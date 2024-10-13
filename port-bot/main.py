from openai import OpenAI
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime, timedelta
import supabase
import json
import os
from dotenv import load_dotenv
import re

app = FastAPI()
# Load environment variables from .env file
load_dotenv()

# Access environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
# Set your OpenAI API key
client = OpenAI(api_key=openai_api_key)
# Initialize Supabase client (make sure you've set your Supabase URL and Key)

supabase_client = supabase.create_client(supabase_url, supabase_key)

# Define the Employee model
class Employee(BaseModel):
    user_id: str
    full_name: str
    department: str
    experience_level: str
    skills: str
    hobbies: str

# Define the Task model
class Task(BaseModel):
    task_id: Optional[str] = None
    user_id: str
    partner_id: Optional[str] = None
    task_description: str  # Limit this in the input generation step (max 10 words)
    task_type: str  # single_fun, pair_fun, single_work, pair_work
    difficulty: str  # easy, medium, hard
    points: int  # Points calculated based on difficulty
    due_by: str  # Due date (formatted as string for easier handling)
    completed: bool = False  # New field for task completion status
    completed_at: Optional[str] = None  # Will be null until task is completed
    created_at: Optional[str] = None  # Default to current date

    @staticmethod
    def calculate_due_date(difficulty: str) -> str:
        """Calculate due date based on difficulty level."""
        days_map = {
            "easy": 1,
            "medium": 3,
            "hard": 5
        }
        days_to_add = days_map.get(difficulty, 1)
        due_date = datetime.now() + timedelta(days=days_to_add)
        return due_date.strftime('%Y-%m-%d')
    @staticmethod
    def calculate_points(difficulty: str) -> int:
        """Calculate points based on difficulty level."""
        points_map = {
            "easy": 3,
            "medium": 5,
            "hard": 10
        }
        return points_map.get(difficulty, 0)

    @classmethod
    def create_task(cls, user_id: str, partner_id: Optional[str], task_description: str, task_type: str, difficulty: str) -> 'Task':
        """Create a task with default values for points and due date."""

        
        return cls(
            user_id=user_id,
            partner_id=partner_id,
            task_description=task_description,
            task_type=task_type,
            difficulty=difficulty,
            points=cls.calculate_points(difficulty),
            due_by=cls.calculate_due_date(difficulty),
            created_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )


# Function to fetch employees from Supabase
def fetch_employees_from_supabase() -> List[Employee]:
    try:
        # Query to fetch all employees from the employees table
        response = supabase_client.table("employees").select("*").execute()
        
        # Parse the data into Employee model instances
        employees_data = response.data
        employees = [Employee(**emp) for emp in employees_data]  # Convert to Employee models
        return employees
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching employees from Supabase: {str(e)}")


def get_fun_partner(employee: Employee, all_employees: List[Employee]) -> Optional[Employee]:
    """Use OpenAI to match a fun partner based on shared hobbies."""
    prompt = f"""
    Find the best match for a fun task based on shared hobbies. 
    The employee is:
    - Name: {employee.full_name} (ID: {employee.user_id})
    - Hobbies: {', '.join(employee.hobbies)}

    The output should just be the employee full name with no extra text. Choose a match from the following employees:
    """
    
    for emp in all_employees:
        if emp.user_id != employee.user_id:
            prompt += f"\n- {emp.full_name} (ID: {emp.user_id}), Hobbies: {', '.join(emp.hobbies)}"
    
    prompt += "\n\nSelect the best match based on shared hobbies and return the partner's name."

    # Use the new OpenAI method to get the partner match
    matched_name = get_openai_partner_match(prompt)
    print(matched_name)

    # Match the partner's name with the employee data and return
    for emp in all_employees:
        if emp.full_name == matched_name:
            return emp
    return None

def get_work_partner(employee: Employee, all_employees: List[Employee]) -> Optional[Employee]:
    """Use OpenAI to match a work partner based on complementary skills."""
    prompt = f"""
    Find the best match for a collaborative work task based on complementary skills. 
    The employee is:
    - Name: {employee.full_name} (ID: {employee.user_id})
    - Department: {employee.department}
    - Skills: {', '.join(employee.skills)}

    The output should only be the employee full name with no extra text. Choose a match from the following employees:
    """
    
    for emp in all_employees:
        if emp.user_id != employee.user_id:
            prompt += f"\n- {emp.full_name} (ID: {emp.user_id}), Department: {emp.department}, Skills: {', '.join(emp.skills)}"
    
    prompt += "\n\nSelect the best match based on complementary skills and return the partner's name."

    # Use the new OpenAI method to get the partner match
    matched_name = get_openai_partner_match(prompt)
    print(matched_name)
    
    # Match the partner's name with the employee data and return
    for emp in all_employees:
        if emp.full_name == matched_name:
            return emp
    return None

def get_openai_partner_match(prompt: str) -> Optional[str]:
    """Helper function to use OpenAI for partner matching based on a provided prompt."""
    try:
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": "You are an assistant that helps find matching partners based on shared hobbies or complementary skills."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10,  # Keep response concise
            temperature=0.5  # Adjust creativity for more consistent output
        )
        return response.choices[0].message.content.strip()  # Extract the matched partner's name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting partner match from OpenAI: {str(e)}")

def generate_task_with_openai(prompt: str, task_type: str) -> dict:
    """Helper function to generate task description using OpenAI with a specified format."""
    formatted_prompt = f"""
You are an assistant generating tasks for employees. Please follow this exact JSON structure for the output.

Task Format:
{{
  "user_id": "<user_id>",
  "partner_id": "<partner_id or null>",
  "task_description": "<task_description (max 10 words)>",
  "task_type": "<task_type>",
  "difficulty": "<difficulty (easy/medium/hard)>",
}}

Please ensure the response is valid JSON and follows the exact format above. Output should not have any extra text.
Generate a task of type {task_type}. {prompt}
"""

    try:
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": "You are an assistant that generates employee tasks in JSON format."},
                {"role": "user", "content": formatted_prompt}
            ],
            max_tokens=1000,  # Limit to 50 tokens for brevity
            temperature=0.7
        )

        # Log raw response for debugging
        raw_response = response.choices[0].message.content.strip()
        if raw_response:
            print(raw_response)

        return json.loads(raw_response)  # Parse as JSON

    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")  # Debug print for JSON errors
        raise HTTPException(status_code=500, detail=f"Error parsing JSON from OpenAI: {str(e)}")
    except Exception as e:
        print(f"General error: {e}")  # Debug print for general errors
        raise HTTPException(status_code=500, detail=f"Error generating task from OpenAI: {str(e)}")

### Task Generation Functions ###
def generate_singular_fun_task(employee: Employee) -> Task:
    prompt = f"""
    Create a fun task for the employee with the following details:
    - Name: {employee.full_name}
    - ID: {employee.user_id}
    - Department: {employee.department}
    - Experience Level: {employee.experience_level}
    - Skills: {', '.join(employee.skills)}
    - Hobbies: {', '.join(employee.hobbies)}.
    
    The task should be based on their hobbies and be engaging.
    """
    task_desc = generate_task_with_openai(prompt, "single_fun")
    
    return Task.create_task(**task_desc)

def generate_pair_fun_task(employee: Employee, partner: Employee) -> Task:
    prompt = f"""
    Create a collaborative fun task for two employees based on their hobbies:
    - Employee 1: {employee.full_name} (ID: {employee.user_id}), Hobbies: {', '.join(employee.hobbies)}
    - Employee 2: {partner.full_name} (ID: {partner.user_id}), Hobbies: {', '.join(partner.hobbies)}.
    
    The task should involve both employees and foster teamwork and engagement.
    """
    task_desc = generate_task_with_openai(prompt, "pair_fun")
    
    return Task.create_task(**task_desc)

def generate_singular_work_task(employee: Employee) -> Task:
    prompt = f"""
    Create a work-related task for the employee with the following details:
    - Name: {employee.full_name}
    - ID: {employee.user_id}
    - Department: {employee.department}
    - Experience Level: {employee.experience_level}
    - Skills: {', '.join(employee.skills)}
    
    The task should be them taking up an upskilling course and be aligned with their current department and skills.
    """
    task_desc = generate_task_with_openai(prompt, "single_work")
    
    return Task.create_task(**task_desc)

def generate_pair_work_task(employee: Employee, partner: Employee) -> Task:
    prompt = f"""
    Create a collaborative work task for two employees based on their skills:
    - Employee 1: {employee.full_name} (ID: {employee.user_id}), Department: {employee.department}, Skills: {employee.skills}
    - Employee 2: {partner.full_name} (ID: {partner.user_id}), Department: {partner.department}, Skills: {partner.skills}
    
    The task should require collaboration between both employees and leverage their skills.
    """
    task_desc = generate_task_with_openai(prompt, "pair_work")
    
    return Task.create_task(**task_desc)

### Main Task Generation for All Employees ###
@app.post("/generate-tasks-for-all")
def generate_tasks_for_all():
    tasks = []
    
    # Convert placeholder employee data to Employee objects
    employee_list = fetch_employees_from_supabase()
    
    # Loop through each employee
    for employee in employee_list:
        # Generate a single fun task
        single_fun_task = generate_singular_fun_task(employee)
        save_task_to_supabase(single_fun_task)  # Save to Supabase
        tasks.append(single_fun_task)
        
        # Generate a pair fun task
        partner_for_fun = get_fun_partner(employee, employee_list)
        if partner_for_fun:
            pair_fun_task = generate_pair_fun_task(employee, partner_for_fun)
            save_task_to_supabase(pair_fun_task)  # Save to Supabase
            tasks.append(pair_fun_task)
        
        # Generate a single work task
        # single_work_task = generate_singular_work_task(employee)
        # save_task_to_supabase(single_work_task)  # Save to Supabase
        # tasks.append(single_work_task)
        
        # Generate a pair work task
        partner_for_work = get_work_partner(employee, employee_list)
        if partner_for_work:
            pair_work_task = generate_pair_work_task(employee, partner_for_work)
            save_task_to_supabase(pair_work_task)  # Save to Supabase
            tasks.append(pair_work_task)
    
    return {"generated_tasks": tasks}

def save_task_to_supabase(task: Task) -> None:
    """
    Function to save a task to Supabase.
    Converts the Task object into a dictionary and inserts it into the 'tasks' table.
    """
    task_data = {
        "user_id": task.user_id,
        "partner_id": task.partner_id,
        "task_description": task.task_description,
        "task_type": task.task_type,
        "difficulty": task.difficulty,
        "points": task.points,
        "due_by": task.due_by,
        "completed": task.completed,
        "completed_at": task.completed_at,
        "created_at": task.created_at
    }
    
    try:
        response = supabase_client.table('tasks').insert(task_data).execute()
        
        print(f"Task for user {task.user_id} saved successfully.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving task to Supabase: {str(e)}")
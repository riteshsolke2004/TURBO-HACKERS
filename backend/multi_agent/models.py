# multi_agent/models.py
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AgentStatus(str, Enum):
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    OFFLINE = "offline"

class AgentType(str, Enum):
    COORDINATOR = "coordinator"
    DATA_GATHERER = "data_gatherer"
    ANALYZER = "analyzer"
    REPORT_GENERATOR = "report_generator"

class Agent(Document):
    name: str
    agent_type: AgentType
    description: List[str] = []
    status: AgentStatus = AgentStatus.IDLE
    capabilities: List[str] = []
    current_task_id: Optional[str] = None
    endpoint_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "agents"

class Task(Document):
    workflow_id: str
    agent_id: str
    name: str
    description: str
    status: str = "pending"
    input_data: Dict[str, Any] = {}
    output_data: Dict[str, Any] = {}
    dependencies: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "tasks"

class Workflow(Document):
    name: str
    description: str
    goal: str
    status: str = "created"
    agent_ids: List[str] = []
    task_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "workflows"

class AgentCreate(BaseModel):
    name: str
    agent_type: AgentType
    description: List[str]
    capabilities: List[str]
    endpoint_url: Optional[str] = None

class WorkflowCreate(BaseModel):
    name: str
    description: str
    goal: str

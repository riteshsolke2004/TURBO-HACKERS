# multi_agent/routes.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from .models import Agent, Workflow, AgentCreate, WorkflowCreate
import logging

logger = logging.getLogger(__name__)

agent_router = APIRouter(prefix="/api/v1/agents", tags=["agents"])
workflow_router = APIRouter(prefix="/api/v1/workflows", tags=["workflows"])

@agent_router.post("/register", response_model=Agent)
async def register_agent(agent_data: AgentCreate):
    try:
        agent = Agent(**agent_data.dict())
        await agent.create()
        logger.info(f"Agent {agent.name} registered successfully")
        return agent
    except Exception as e:
        logger.error(f"Failed to register agent: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@agent_router.get("/", response_model=List[Agent])
async def get_all_agents():
    try:
        return await Agent.find_all().to_list()
    except Exception as e:
        logger.error(f"Failed to get agents: {e}")
        return []

@workflow_router.post("/", response_model=Workflow)
async def create_workflow(workflow_data: WorkflowCreate):
    try:
        workflow = Workflow(**workflow_data.dict())
        await workflow.create()
        logger.info(f"Workflow {workflow.name} created successfully")
        return workflow
    except Exception as e:
        logger.error(f"Failed to create workflow: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@workflow_router.get("/", response_model=List[Workflow])
async def get_workflows():
    try:
        return await Workflow.find_all().to_list()
    except Exception as e:
        logger.error(f"Failed to get workflows: {e}")
        return []

@workflow_router.post("/{workflow_id}/start")
async def start_workflow(workflow_id: str, background_tasks: BackgroundTasks):
    try:
        workflow = await Workflow.get(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # TODO: Add actual workflow execution logic here
        workflow.status = "running"
        await workflow.save()
        
        return {"message": "Workflow started", "workflow_id": workflow_id}
    except Exception as e:
        logger.error(f"Failed to start workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

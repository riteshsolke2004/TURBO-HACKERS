# multi_agent/services.py
import asyncio
import httpx
from typing import Dict, Any, List
from datetime import datetime
from .models import Agent, Task, Workflow, AgentStatus
from .websocket import manager
import logging

logger = logging.getLogger(__name__)

class AgentService:
    def __init__(self):
        self.http_client = httpx.AsyncClient(timeout=30.0)
    
    async def execute_task(self, agent: Agent, task: Task) -> Dict[str, Any]:
        """Execute task using agent"""
        try:
            # Update statuses
            agent.status = AgentStatus.BUSY
            await agent.save()
            
            # Notify frontend
            await manager.send_to_workflow(task.workflow_id, {
                "type": "task_started",
                "agent_id": str(agent.id),
                "task_id": str(task.id),
                "agent_name": agent.name,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Execute via teammate's LangGraph endpoint or mock
            if agent.endpoint_url:
                result = await self.call_langgraph_agent(agent, task)
            else:
                result = await self.mock_execution(agent, task)
            
            # Update completion
            agent.status = AgentStatus.IDLE
            await agent.save()
            
            # Notify completion
            await manager.send_to_workflow(task.workflow_id, {
                "type": "task_completed",
                "agent_id": str(agent.id),
                "task_id": str(task.id),
                "result": result,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            return result
            
        except Exception as e:
            logger.error(f"Task execution failed: {e}")
            agent.status = AgentStatus.ERROR
            await agent.save()
            raise e
    
    async def call_langgraph_agent(self, agent: Agent, task: Task) -> Dict[str, Any]:
        """Call your teammate's LangGraph agent"""
        payload = {
            "task_id": str(task.id),
            "task_name": task.name,
            "description": task.description,
            "input_data": task.input_data,
            "agent_type": agent.agent_type
        }
        
        response = await self.http_client.post(
            f"{agent.endpoint_url}/execute",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def mock_execution(self, agent: Agent, task: Task) -> Dict[str, Any]:
        """Mock execution for testing"""
        await asyncio.sleep(2)  # Simulate processing
        return {
            "status": "success",
            "message": f"Task completed by {agent.name}",
            "data": {"processed_at": datetime.utcnow().isoformat()}
        }

# Global agent service instance
agent_service = AgentService()

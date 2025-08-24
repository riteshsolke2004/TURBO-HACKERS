# multi_agent/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, workflow_id: str):
        await websocket.accept()
        if workflow_id not in self.active_connections:
            self.active_connections[workflow_id] = []
        self.active_connections[workflow_id].append(websocket)
        logger.info(f"WebSocket connected to workflow {workflow_id}")
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connected",
            "message": f"Connected to workflow {workflow_id}",
            "workflow_id": workflow_id
        }))
        
    def disconnect(self, websocket: WebSocket, workflow_id: str):
        if workflow_id in self.active_connections:
            if websocket in self.active_connections[workflow_id]:
                self.active_connections[workflow_id].remove(websocket)
            if not self.active_connections[workflow_id]:
                del self.active_connections[workflow_id]
        logger.info(f"WebSocket disconnected from workflow {workflow_id}")
            
    async def send_to_workflow(self, workflow_id: str, message: dict):
        if workflow_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[workflow_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except WebSocketDisconnect:
                    disconnected.append(connection)
                except Exception as e:
                    logger.error(f"Error sending message: {e}")
                    disconnected.append(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                if conn in self.active_connections[workflow_id]:
                    self.active_connections[workflow_id].remove(conn)
    
    async def send_to_all(self, message: dict):
        for workflow_id in list(self.active_connections.keys()):
            await self.send_to_workflow(workflow_id, message)

# Global connection manager instance
manager = ConnectionManager()

"""
Simulation API - scenario prediction endpoints
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.simulation_service import SimulationService


router = APIRouter()


class SimulationRequest(BaseModel):
    investimento: float = Field(..., ge=100, le=5000, description="Investimento em milhões de US$")
    capacidade: float = Field(..., ge=50, le=2000, description="Capacidade em MW")
    localizacao: str = Field(..., description="Localização: Pecém, Fortaleza ou Interior")
    fonteEnergia: str = Field(..., description="Fonte: Eólica, Solar ou Híbrida")
    
    class Config:
        json_schema_extra = {
            "example": {
                "investimento": 500,
                "capacidade": 200,
                "localizacao": "Pecém",
                "fonteEnergia": "Eólica"
            }
        }


class DimensionScores(BaseModel):
    economico: int
    social: int
    ambiental: int
    infraestrutura: int


class SimulationResponse(BaseModel):
    empregos: int
    pib: float
    co2Reduzido: int
    h2Produzido: int
    roi: float
    riskScore: int
    dimensoes: DimensionScores


@router.post("", response_model=SimulationResponse)
async def run_simulation(
    request: SimulationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Run a scenario simulation for H2V investments.
    
    Returns predicted impacts on:
    - Employment
    - GDP
    - CO2 avoided
    - H2 production
    - ROI
    - Risk score
    """
    
    # Validate inputs
    valid_locations = ["Pecém", "Fortaleza", "Interior"]
    if request.localizacao not in valid_locations:
        request.localizacao = "Pecém"
    
    valid_sources = ["Eólica", "Solar", "Híbrida"]
    if request.fonteEnergia not in valid_sources:
        request.fonteEnergia = "Eólica"
    
    # Run simulation
    results = SimulationService.run_simulation(
        investimento=request.investimento,
        capacidade=request.capacidade,
        localizacao=request.localizacao,
        fonte_energia=request.fonteEnergia,
    )
    
    # Save to database
    await SimulationService.save_simulation(
        db=db,
        user_id=None,  # TODO: get from auth
        params={
            "investimento": request.investimento,
            "capacidade": request.capacidade,
            "localizacao": request.localizacao,
            "fonteEnergia": request.fonteEnergia,
        },
        results=results,
    )
    
    return SimulationResponse(
        empregos=results["empregos"],
        pib=results["pib"],
        co2Reduzido=results["co2Reduzido"],
        h2Produzido=results["h2Produzido"],
        roi=results["roi"],
        riskScore=results["riskScore"],
        dimensoes=DimensionScores(**results["dimensoes"]),
    )


@router.get("/parameters")
async def get_parameters():
    """Get available parameter options for simulation"""
    return {
        "investimento": {
            "min": 100,
            "max": 5000,
            "step": 50,
            "unit": "M US$",
            "default": 500,
        },
        "capacidade": {
            "min": 50,
            "max": 2000,
            "step": 25,
            "unit": "MW",
            "default": 200,
        },
        "localizacao": {
            "options": ["Pecém", "Fortaleza", "Interior"],
            "default": "Pecém",
        },
        "fonteEnergia": {
            "options": ["Eólica", "Solar", "Híbrida"],
            "default": "Eólica",
        },
    }

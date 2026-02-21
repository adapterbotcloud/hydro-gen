"""
Simulation Service - scenario prediction engine
"""
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.simulation import Simulation


class SimulationService:
    """
    Service for running H2V scenario simulations
    Uses predictive models based on historical data from IBGE, IPECE, ANEEL
    """
    
    # Multipliers by energy source
    SOURCE_MULTIPLIERS = {
        "Eólica": 1.2,
        "Solar": 1.0,
        "Híbrida": 1.35,
    }
    
    # Multipliers by location
    LOCATION_MULTIPLIERS = {
        "Pecém": 1.3,      # Hub principal, melhor infraestrutura
        "Fortaleza": 1.1,  # Capital, boa infraestrutura
        "Interior": 0.9,   # Menor infraestrutura, maior distância
    }
    
    # Base coefficients (derived from historical data)
    BASE_JOBS_PER_MILLION = 95           # Empregos diretos+indiretos por milhão US$
    BASE_GDP_IMPACT = 0.08               # % de impacto no PIB por milhão US$
    BASE_CO2_AVOIDED_PER_MW = 4.2        # Toneladas CO2/ano por MW
    BASE_H2_PRODUCTION_PER_MW = 0.85     # Mil toneladas H2/ano por MW
    
    @staticmethod
    def run_simulation(
        investimento: float,  # Milhões US$
        capacidade: float,    # MW
        localizacao: str,     # Pecém, Fortaleza, Interior
        fonte_energia: str,   # Eólica, Solar, Híbrida
    ) -> Dict[str, Any]:
        """
        Run a scenario simulation and return predicted impacts
        """
        # Get multipliers
        source_mult = SimulationService.SOURCE_MULTIPLIERS.get(fonte_energia, 1.0)
        location_mult = SimulationService.LOCATION_MULTIPLIERS.get(localizacao, 1.0)
        combined_mult = source_mult * location_mult
        
        # Calculate impacts
        empregos = round(
            investimento * SimulationService.BASE_JOBS_PER_MILLION * combined_mult
        )
        
        pib_impact = round(
            investimento * SimulationService.BASE_GDP_IMPACT * combined_mult, 1
        )
        
        co2_avoided = round(
            capacidade * SimulationService.BASE_CO2_AVOIDED_PER_MW * source_mult
        )
        
        h2_produced = round(
            capacidade * SimulationService.BASE_H2_PRODUCTION_PER_MW * source_mult
        )
        
        # ROI estimation (years to payback)
        # Base: 4 years, adjusted by location and source efficiency
        roi_years = round(4.0 / combined_mult + 1.5, 1)
        
        # Risk score (0-100, lower is better)
        # Based on location maturity and source reliability
        base_risk = 40
        if localizacao == "Pecém":
            base_risk -= 15  # Lower risk due to existing infrastructure
        elif localizacao == "Interior":
            base_risk += 10  # Higher risk due to logistics
        
        if fonte_energia == "Híbrida":
            base_risk -= 5   # Lower risk due to diversification
        
        # Add some variability
        import random
        risk_score = max(10, min(90, base_risk + random.randint(-10, 10)))
        
        # Dimensional impact scores
        economico = min(100, round(60 + (investimento / 20) * combined_mult))
        social = min(100, round(50 + (empregos / 1000) * 2))
        ambiental = min(100, round(70 + (co2_avoided / 500) * 3))
        infraestrutura = min(100, round(40 + (location_mult * 30)))
        
        return {
            "empregos": empregos,
            "pib": pib_impact,
            "co2Reduzido": co2_avoided,
            "h2Produzido": h2_produced,
            "roi": roi_years,
            "riskScore": risk_score,
            "dimensoes": {
                "economico": economico,
                "social": social,
                "ambiental": ambiental,
                "infraestrutura": infraestrutura,
            }
        }
    
    @staticmethod
    async def save_simulation(
        db: AsyncSession,
        user_id: Optional[int],
        params: Dict[str, Any],
        results: Dict[str, Any],
    ) -> Simulation:
        """Save a simulation to the database"""
        simulation = Simulation(
            user_id=user_id,
            params=params,
            results=results,
        )
        
        db.add(simulation)
        await db.commit()
        await db.refresh(simulation)
        
        return simulation

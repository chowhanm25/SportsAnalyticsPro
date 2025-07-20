from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import snowflake.connector
import os
from dotenv import load_dotenv
from typing import Optional, Dict, List
import logging
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Sports Player Stats API",
    description="API for accessing complete cricket and football player data from Snowflake",
    version="2.0.0"
)

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class PlayerResponse(BaseModel):
    status: str
    count: int
    data: List[Dict]

class CricketPlayerCreate(BaseModel):
    Team: str
    Format: str
    Gender: str
    No: int
    Name: str
    First: str
    Last: str
    Mat: int
    Runs: int
    HS: int
    Avg: float
    Fifty: int
    Hundred: int
    Balls: int
    Wkt: int
    BBI: str
    Ave: float
    FiveWI: int
    Ca: int
    St: int

class FootballPlayerCreate(BaseModel):
    PlayerID: int
    Name: str
    Age: int
    Nationality: str
    Overall: int
    Club: str
    Value: str
    Wage: str
    PreferredFoot: str
    InternationalReputation: int
    WeakFoot: int
    SkillMoves: int
    Position: str
    JerseyNumber: int
    Height: str
    Weight: str
    Crossing: int
    Finishing: int
    HeadingAccuracy: int
    ShortPassing: int
    Volleys: int
    Dribbling: int
    Curve: int
    FKAccuracy: int
    LongPassing: int
    BallControl: int
    Acceleration: int
    SprintSpeed: int
    Agility: int
    Reactions: int
    Balance: int
    ShotPower: int
    Jumping: int
    Stamina: int
    Strength: int
    LongShots: int
    Aggression: int
    Interceptions: int
    Positioning: int
    Vision: int
    Penalties: int
    Composure: int
    Marking: int
    StandingTackle: int
    SlidingTackle: int
    GKDiving: int
    GKHandling: int
    GKKicking: int
    GKPositioning: int
    GKReflexes: int

class PredictionRequest(BaseModel):
    player_ids: List[int]

def get_snowflake_connection():
    """Establish and return a Snowflake database connection"""
    try:
        conn = snowflake.connector.connect(
            user=os.getenv('SNOWFLAKE_USER'),
            password=os.getenv('SNOWFLAKE_PASSWORD'),
            account=os.getenv('SNOWFLAKE_ACCOUNT'),
            warehouse=os.getenv('SNOWFLAKE_WAREHOUSE'),
            database=os.getenv('SNOWFLAKE_DATABASE'),
            schema=os.getenv('SNOWFLAKE_SCHEMA'),
            role=os.getenv('SNOWFLAKE_ROLE', 'PUBLIC')
        )
        logger.info("Successfully connected to Snowflake")
        return conn
    except Exception as e:
        logger.error(f"Snowflake connection error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to connect to database",
                "error": str(e)
            }
        )

# Cricket Endpoints
@app.get("/cricket/players/all", response_model=PlayerResponse)
async def get_all_cricket_players():
    """Get ALL cricket players data without any filters or limits"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT *
        FROM CRICKETPLAYERS.PUBLIC.CRICKETPLAYER
        """
        
        logger.info("Executing query to fetch all cricket players data")
        cursor.execute(query)
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return {
            "status": "success",
            "count": len(results),
            "data": results
        }
        
    except Exception as e:
        logger.error(f"Error fetching all cricket players: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to fetch all cricket players data",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

@app.get("/cricket/players", response_model=PlayerResponse)
async def get_filtered_cricket_players(
    team: Optional[str] = Query(None),
    format: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    limit: int = Query(100, gt=0, le=1000)
):
    """Get filtered cricket players data with optional parameters"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT *
        FROM CRICKETPLAYERS.PUBLIC.CRICKETPLAYER
        WHERE 1=1
        """
        
        params = []
        if team:
            query += " AND Team = %s"
            params.append(team)
        if format:
            query += " AND Format = %s"
            params.append(format)
        if gender:
            query += " AND Gender = %s"
            params.append(gender)
            
        query += f" LIMIT {limit}"
        
        logger.info(f"Executing filtered cricket query: {query}")
        cursor.execute(query, params)
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return {
            "status": "success",
            "count": len(results),
            "data": results
        }
        
    except Exception as e:
        logger.error(f"Error fetching filtered cricket players: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to fetch filtered cricket players",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

@app.post("/cricket/players", response_model=PlayerResponse)
async def create_cricket_player(player: CricketPlayerCreate):
    """Add a new cricket player to the database"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO CRICKETPLAYERS.PUBLIC.CRICKETPLAYER
        (Team, Format, Gender, No, Name, First, Last, Mat, Runs, HS, 
         Avg, 50, 100, Balls, Wkt, BBI, Ave, 5WI, Ca, St)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            player.Team, player.Format, player.Gender, player.No, player.Name,
            player.First, player.Last, player.Mat, player.Runs, player.HS,
            player.Avg, player.Fifty, player.Hundred, player.Balls, player.Wkt,
            player.BBI, player.Ave, player.FiveWI, player.Ca, player.St
        )
        
        cursor.execute(query, params)
        conn.commit()
        
        return {
            "status": "success",
            "count": 1,
            "data": [player.dict()]
        }
        
    except Exception as e:
        logger.error(f"Error adding cricket player: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to add cricket player",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

# Football Endpoints
@app.get("/football/players/all", response_model=PlayerResponse)
async def get_all_football_players():
    """Get ALL football players data without any filters or limits"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT *
        FROM PLAYERFOOTBALL.PUBLIC.PLAYERFOOTBALL
        """
        
        logger.info("Executing query to fetch all football players data")
        cursor.execute(query)
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return {
            "status": "success",
            "count": len(results),
            "data": results
        }
        
    except Exception as e:
        logger.error(f"Error fetching all football players: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to fetch all football players data",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

@app.get("/football/players", response_model=PlayerResponse)
async def get_filtered_football_players(
    club: Optional[str] = Query(None),
    nationality: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    min_rating: Optional[int] = Query(None, ge=0, le=100),
    max_rating: Optional[int] = Query(None, ge=0, le=100),
    limit: int = Query(100, gt=0, le=1000)
):
    """Get filtered football players data with optional parameters"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT *
        FROM PLAYERFOOTBALL.PUBLIC.PLAYERFOOTBALL
        WHERE 1=1
        """
        
        params = []
        if club:
            query += " AND Club = %s"
            params.append(club)
        if nationality:
            query += " AND Nationality = %s"
            params.append(nationality)
        if position:
            query += " AND Position = %s"
            params.append(position)
        if min_rating:
            query += " AND Overall >= %s"
            params.append(min_rating)
        if max_rating:
            query += " AND Overall <= %s"
            params.append(max_rating)
            
        query += f" LIMIT {limit}"
        
        logger.info(f"Executing filtered football query: {query}")
        cursor.execute(query, params)
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return {
            "status": "success",
            "count": len(results),
            "data": results
        }
        
    except Exception as e:
        logger.error(f"Error fetching filtered football players: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to fetch filtered football players",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

@app.post("/football/players", response_model=PlayerResponse)
async def create_football_player(player: FootballPlayerCreate):
    """Add a new football player to the database"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO PLAYERFOOTBALL.PUBLIC.PLAYERFOOTBALL
        (PlayerID, Name, Age, Nationality, Overall, Club, Value, Wage, PreferredFoot,
         InternationalReputation, WeakFoot, SkillMoves, Position, JerseyNumber, Height,
         Weight, Crossing, Finishing, HeadingAccuracy, ShortPassing, Volleys, Dribbling,
         Curve, FKAccuracy, LongPassing, BallControl, Acceleration, SprintSpeed, Agility,
         Reactions, Balance, ShotPower, Jumping, Stamina, Strength, LongShots, Aggression,
         Interceptions, Positioning, Vision, Penalties, Composure, Marking, StandingTackle,
         SlidingTackle, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            player.PlayerID, player.Name, player.Age, player.Nationality, player.Overall,
            player.Club, player.Value, player.Wage, player.PreferredFoot,
            player.InternationalReputation, player.WeakFoot, player.SkillMoves,
            player.Position, player.JerseyNumber, player.Height, player.Weight,
            player.Crossing, player.Finishing, player.HeadingAccuracy, player.ShortPassing,
            player.Volleys, player.Dribbling, player.Curve, player.FKAccuracy,
            player.LongPassing, player.BallControl, player.Acceleration, player.SprintSpeed,
            player.Agility, player.Reactions, player.Balance, player.ShotPower,
            player.Jumping, player.Stamina, player.Strength, player.LongShots,
            player.Aggression, player.Interceptions, player.Positioning, player.Vision,
            player.Penalties, player.Composure, player.Marking, player.StandingTackle,
            player.SlidingTackle, player.GKDiving, player.GKHandling, player.GKKicking,
            player.GKPositioning, player.GKReflexes
        )
        
        cursor.execute(query, params)
        conn.commit()
        
        return {
            "status": "success",
            "count": 1,
            "data": [player.dict()]
        }
        
    except Exception as e:
        logger.error(f"Error adding football player: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Failed to add football player",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

# Combined Prediction Endpoint
@app.post("/predict", response_model=Dict)
async def predict_performance(request: PredictionRequest):
    """Predict performance for selected players (works for both cricket and football)"""
    try:
        # Your prediction logic here
        # This is a placeholder - implement your actual prediction algorithm
        
        # First try cricket players
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        cricket_query = """
        SELECT * FROM CRICKETPLAYERS.PUBLIC.CRICKETPLAYER
        WHERE No IN (%s)
        """ % ','.join(['%s']*len(request.player_ids))
        
        cursor.execute(cricket_query, request.player_ids)
        cricket_players = [dict(zip([col[0] for col in cursor.description], row)) 
                         for row in cursor.fetchall()]
        
        # Then try football players if no cricket players found
        if not cricket_players:
            football_query = """
            SELECT * FROM PLAYERFOOTBALL.PUBLIC.PLAYERFOOTBALL
            WHERE PlayerID IN (%s)
            """ % ','.join(['%s']*len(request.player_ids))
            
            cursor.execute(football_query, request.player_ids)
            football_players = [dict(zip([col[0] for col in cursor.description], row)) 
                              for row in cursor.fetchall()]
            
            if football_players:
                # Football prediction logic
                avg_rating = sum(p['Overall'] for p in football_players) / len(football_players)
                win_probability = min(100, avg_rating * 0.9)
                
                return {
                    "status": "success",
                    "sport": "football",
                    "prediction": {
                        "average_rating": avg_rating,
                        "win_probability": win_probability,
                        "key_players": [p['Name'] for p in football_players[:3]]
                    }
                }
        
        # Cricket prediction logic (if cricket players found)
        if cricket_players:
            avg_score = sum(p['Runs'] for p in cricket_players) / len(cricket_players) if cricket_players else 0
            win_probability = min(100, avg_score * 0.8)
            
            return {
                "status": "success",
                "sport": "cricket",
                "prediction": {
                    "average_score": avg_score,
                    "win_probability": win_probability,
                    "key_players": [p['Name'] for p in cricket_players[:3]]
                }
            }
        
        # No players found
        return {
            "status": "success",
            "message": "No players found with the given IDs",
            "prediction": None
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Prediction failed",
                "error": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close()

@app.get("/")
async def root():
    return {
        "message": "Sports Player Stats API",
        "endpoints": {
            "cricket": {
                "/cricket/players/all": "GET all cricket player data",
                "/cricket/players": "GET filtered cricket player data",
                "/cricket/players [POST]": "Add new cricket player"
            },
            "football": {
                "/football/players/all": "GET all football player data",
                "/football/players": "GET filtered football player data",
                "/football/players [POST]": "Add new football player"
            },
            "/predict [POST]": "Predict performance for selected players (both sports)"
        }
    }
"""
Team Strength Features

ELO ratings, win rates, offensive/defensive ratings.
"""


def calculate_elo_ratings(games, initial_rating=1500, k_factor=20):
    """
    Calculate ELO ratings for all teams.
    
    Args:
        games: List of games with outcomes
        initial_rating: Starting ELO (default 1500)
        k_factor: Sensitivity to new results (default 20)
    
    Returns:
        dict: {team_id: elo_rating}
    """
    # TODO: Implement ELO system
    # - Initialize all teams at 1500
    # - For each game (chronologically):
    #     - Calculate expected win prob: 1 / (1 + 10^((elo_B - elo_A) / 400))
    #     - Update: new_elo_A = old_elo_A + K * (actual - expected)
    # - Store history for lookback
    
    print("📊 Calculating ELO ratings (STUB)")
    return {}


def calculate_team_stats(games, team_id):
    """
    Calculate aggregate team statistics.
    
    Args:
        games: Historical games for this team
        team_id: Team identifier
    
    Returns:
        dict: Team statistics
    """
    # TODO: Calculate:
    # - Win percentage
    # - Points per game
    # - Points allowed per game
    # - Point differential
    # - Offensive rating (points per 100 possessions)
    # - Defensive rating (points allowed per 100 possessions)
    # - Pace (possessions per game)
    
    print(f"📊 Calculating team stats for {team_id} (STUB)")
    return {
        "win_pct": 0.5,
        "ppg": 110.0,
        "opp_ppg": 108.0,
        "point_diff": 2.0,
        "offensive_rating": 112.0,
        "defensive_rating": 110.0,
        "pace": 100.0,
    }


def calculate_strength_of_schedule(team_id, opponent_elos):
    """
    Calculate strength of schedule based on opponent ELOs.
    
    Args:
        team_id: Team identifier
        opponent_elos: List of opponent ELO ratings
    
    Returns:
        float: Average opponent ELO
    """
    # TODO: Calculate average opponent strength
    print(f"📊 Calculating SOS for {team_id} (STUB)")
    return 1500.0


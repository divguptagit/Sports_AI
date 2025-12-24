"""
Recent Performance Features

Last N games, win streaks, momentum indicators.
"""


def calculate_last_n_games(games, n=10):
    """
    Calculate statistics from last N games.
    
    Args:
        games: Historical games (chronologically ordered)
        n: Number of games to consider
    
    Returns:
        dict: Recent performance stats
    """
    # TODO: From last N games, calculate:
    # - Wins/losses
    # - Points scored (average)
    # - Points allowed (average)
    # - Point differential
    # - Win percentage
    # - Offensive/defensive efficiency
    
    print(f"📈 Calculating last {n} games (STUB)")
    return {
        "wins": 6,
        "losses": 4,
        "ppg": 112.0,
        "opp_ppg": 108.0,
        "point_diff": 4.0,
        "win_pct": 0.6,
    }


def calculate_win_streak(games):
    """
    Calculate current win/loss streak.
    
    Args:
        games: Historical games (most recent first)
    
    Returns:
        int: Streak length (positive = wins, negative = losses)
    """
    # TODO: Count consecutive wins or losses
    # - Start from most recent game
    # - Count until streak breaks
    # - Return positive for wins, negative for losses
    
    print("🔥 Calculating win streak (STUB)")
    return 3  # Example: 3-game win streak


def calculate_momentum(recent_games):
    """
    Calculate team momentum indicator.
    
    Args:
        recent_games: Last 5-10 games
    
    Returns:
        float: Momentum score (-1 to 1)
    """
    # TODO: Consider:
    # - Win/loss trend (improving or declining)
    # - Point differential trend
    # - Performance against quality opponents
    # - Recent vs older games (weighted)
    
    print("⚡ Calculating momentum (STUB)")
    return 0.5


def calculate_home_away_splits(games, location="home"):
    """
    Calculate home/away performance splits.
    
    Args:
        games: Historical games
        location: "home" or "away"
    
    Returns:
        dict: Performance at specified location
    """
    # TODO: Filter games by location
    # Calculate all standard metrics split by home/away
    
    print(f"🏠 Calculating {location} splits (STUB)")
    return {
        "win_pct": 0.6,
        "ppg": 115.0,
        "opp_ppg": 107.0,
    }


def calculate_clutch_performance(games):
    """
    Calculate performance in close games.
    
    Args:
        games: Historical games
    
    Returns:
        dict: Clutch stats
    """
    # TODO: Filter to close games (margin <= 5 points)
    # Calculate win rate and performance in clutch situations
    
    print("🎯 Calculating clutch performance (STUB)")
    return {
        "close_game_win_pct": 0.55,
        "close_games": 20,
    }


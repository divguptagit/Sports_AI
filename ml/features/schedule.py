"""
Schedule Features

Rest days, back-to-back games, travel distance.
"""


def calculate_rest_days(game_date, previous_game_date):
    """
    Calculate days of rest since last game.
    
    Args:
        game_date: Date of current game
        previous_game_date: Date of previous game
    
    Returns:
        int: Days of rest (0 = back-to-back)
    """
    # TODO: Calculate date difference
    # - 0 days = back-to-back
    # - 1 day = 1 day rest
    # - etc.
    
    print("⏰ Calculating rest days (STUB)")
    return 2


def detect_back_to_back(game_date, previous_game_date):
    """
    Detect if this is a back-to-back game.
    
    Args:
        game_date: Date of current game
        previous_game_date: Date of previous game
    
    Returns:
        bool: True if back-to-back
    """
    rest_days = calculate_rest_days(game_date, previous_game_date)
    return rest_days == 0


def calculate_travel_distance(team_id, previous_venue, current_venue):
    """
    Calculate travel distance between games.
    
    Args:
        team_id: Team identifier
        previous_venue: Previous game city
        current_venue: Current game city
    
    Returns:
        float: Distance in miles
    """
    # TODO: Use city coordinates to calculate distance
    # - Store city lat/long in database
    # - Calculate great circle distance
    # - Consider time zones
    
    print(f"✈️  Calculating travel for {team_id} (STUB)")
    return 0.0


def calculate_schedule_strength(upcoming_games):
    """
    Calculate upcoming schedule difficulty.
    
    Args:
        upcoming_games: Next N games
    
    Returns:
        float: Schedule strength score
    """
    # TODO: Consider:
    # - Opponent strength
    # - Rest days between games
    # - Home/away balance
    # - Travel distance
    
    print("📅 Calculating schedule strength (STUB)")
    return 0.5


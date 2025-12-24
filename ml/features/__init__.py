"""
Feature Engineering Module

Contains feature extractors for ML models.
"""

from .team_strength import calculate_elo_ratings, calculate_team_stats
from .schedule import calculate_rest_days, detect_back_to_back
from .recent_performance import calculate_last_n_games, calculate_win_streak

__all__ = [
    "calculate_elo_ratings",
    "calculate_team_stats",
    "calculate_rest_days",
    "detect_back_to_back",
    "calculate_last_n_games",
    "calculate_win_streak",
]


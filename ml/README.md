# Machine Learning Pipeline for Sports Predictions

**IMPORTANT**: This is for **analytics and educational purposes only**. Not betting advice or recommendations.

## Overview

This ML pipeline predicts:
1. **Win Probability**: P(Home Win) and P(Away Win)
2. **Spread**: Predicted point differential (negative = home favored)
3. **Total**: Predicted combined score

## Architecture

### Model Types

- **Win Probability Model**: Binary classification (home win/away win)
- **Spread Model**: Regression (predicting point differential)
- **Total Model**: Regression (predicting combined score)

All models output confidence intervals and calibration metrics.

---

## Data Requirements

### Required Database Tables

#### Core Tables (Already Available)
- `Game` - Historical games with results
- `Team` - Team information and metadata
- `League` - League information
- `OddsSnapshot` - Historical odds data (for feature engineering)

#### Additional Fields Needed

**Team Statistics** (To be added):
```sql
CREATE TABLE TeamStats (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES Team(id),
  season TEXT,
  games_played INT,
  wins INT,
  losses INT,
  points_per_game FLOAT,
  points_allowed_per_game FLOAT,
  offensive_rating FLOAT,
  defensive_rating FLOAT,
  pace FLOAT,
  elo_rating FLOAT,
  updated_at TIMESTAMP
);
```

**Game Features** (Computed):
```sql
CREATE TABLE GameFeatures (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES Game(id),
  home_elo FLOAT,
  away_elo FLOAT,
  home_rest_days INT,
  away_rest_days INT,
  home_back_to_back BOOLEAN,
  away_back_to_back BOOLEAN,
  home_win_streak INT,
  away_win_streak INT,
  home_l10_record TEXT,
  away_l10_record TEXT,
  injuries_impact_home FLOAT,
  injuries_impact_away FLOAT,
  created_at TIMESTAMP
);
```

---

## Feature Engineering

### Feature Categories

#### 1. **Team Strength Features**
- ELO ratings (updated after each game)
- Win/loss records (overall, last 10, last 5)
- Offensive/defensive ratings
- Point differential averages
- Win streak/loss streak

#### 2. **Schedule Features**
- Rest days since last game (0-7+)
- Back-to-back indicator (boolean)
- Days since season start
- Game number in season
- Travel distance (home/away/neutral)

#### 3. **Recent Performance**
- Last 5 games: wins, points scored, points allowed
- Last 10 games: same metrics
- Home/away splits (last 5 home games, last 5 away games)
- Momentum indicators (improving/declining)

#### 4. **Matchup Features**
- Head-to-head record (last 3 seasons)
- ELO difference (home - away)
- Offensive rating diff
- Defensive rating diff
- Pace differential

#### 5. **Situational Features**
- Home court advantage (boolean)
- Day of week (NBA: back-to-back heavy on Wed/Thu)
- Month of season (fatigue accumulates)
- Playoff implications (boolean - future)

#### 6. **Injury Impact** (Placeholder)
- Estimated value lost from injuries (0-1 scale)
- Key player out indicator
- Depth chart impact

#### 7. **Market Features** (Optional)
- Opening line (market consensus)
- Line movement direction
- Public betting percentage (if available)

### Feature Engineering Pipeline

```
Raw Data → Feature Extraction → Feature Selection → Normalization → Model Input
```

---

## Training Approach

### 1. **Time-Split Validation**

**Critical**: Use time-based splits to prevent data leakage

```python
# Example split strategy
train_cutoff = "2023-10-01"  # Start of this season
val_cutoff = "2024-03-01"     # Recent games for validation
test_cutoff = "2024-11-01"    # Hold-out for final evaluation

train_data = games[games.date < train_cutoff]
val_data = games[(games.date >= train_cutoff) & (games.date < val_cutoff)]
test_data = games[games.date >= test_cutoff]
```

**Why**: Games are not IID (independent and identically distributed). Team strength changes over time, so we must train on past data and predict future games.

### 2. **Cross-Validation**

Use **time-series cross-validation** with expanding window:

```
Fold 1: Train [Season 1-2] → Validate [Season 3]
Fold 2: Train [Season 1-3] → Validate [Season 4]
Fold 3: Train [Season 1-4] → Validate [Season 5]
```

### 3. **Model Selection**

**Candidate Models**:
1. **Logistic Regression** (baseline) - fast, interpretable
2. **Gradient Boosting** (XGBoost/LightGBM) - usually best for tabular
3. **Random Forest** - good for feature importance
4. **Neural Network** (optional) - for complex interactions

**Recommendation**: Start with LightGBM (fast, accurate, calibrated)

### 4. **Hyperparameter Tuning**

Use Bayesian optimization or grid search on validation set:
- Learning rate
- Max depth
- Number of estimators
- Regularization parameters

---

## Evaluation Metrics

### 1. **Win Probability (Classification)**

**Primary Metrics**:
- **Log Loss (Cross-Entropy)**: Measures probabilistic accuracy
  - Lower is better (0 = perfect)
  - Penalizes confident wrong predictions heavily
  - Target: < 0.65 is good, < 0.60 is excellent

- **Brier Score**: Measures calibration
  - (predicted_prob - actual_outcome)²
  - Lower is better (0 = perfect)
  - Target: < 0.25 is good

- **Calibration Plot**: Predicted prob vs actual outcome
  - Should be close to diagonal line
  - Shows if model is over/under-confident

**Secondary Metrics**:
- Accuracy (wins/total games)
- AUC-ROC
- Precision/Recall

### 2. **Spread (Regression)**

**Primary Metrics**:
- **Mean Absolute Error (MAE)**: Average points off
  - Target: < 7 points for NBA, < 10 for NFL
  
- **Root Mean Squared Error (RMSE)**: Penalizes large errors
  - Target: < 9 points for NBA, < 12 for NFL

- **Coverage**: % of actual spreads within confidence interval
  - Target: ~80% for 80% CI

**Secondary Metrics**:
- R² score
- Against-the-spread (ATS) accuracy (>52.4% = profitable vs vig)

### 3. **Total (Regression)**

Same as spread metrics:
- MAE, RMSE, Coverage
- Over/Under accuracy

### 4. **Calibration Analysis**

**For Win Probability**:
- Bin predictions into deciles (0-10%, 10-20%, ..., 90-100%)
- For each bin, compare average predicted prob to actual win rate
- Plot calibration curve

**Example**:
```
Predicted 60-70% → Actual win rate should be ~65%
Predicted 80-90% → Actual win rate should be ~85%
```

---

## Implementation Plan

### Phase 1: Data Preparation (2-4 weeks)
- [ ] Collect historical game data (3+ seasons)
- [ ] Build ELO rating system
- [ ] Calculate team statistics (offense, defense, pace)
- [ ] Compute schedule features (rest days, back-to-back)
- [ ] Create feature extraction pipeline

### Phase 2: Baseline Model (1-2 weeks)
- [ ] Train simple logistic regression
- [ ] Establish baseline metrics
- [ ] Implement evaluation suite
- [ ] Generate calibration plots

### Phase 3: Production Model (2-3 weeks)
- [ ] Train gradient boosting models
- [ ] Hyperparameter tuning
- [ ] Ensemble methods (optional)
- [ ] Final evaluation on hold-out test set

### Phase 4: Deployment (1 week)
- [ ] Model serving infrastructure
- [ ] Batch prediction pipeline
- [ ] Monitoring and alerting
- [ ] A/B testing framework

---

## Local Training Setup

### Prerequisites

```bash
# Python 3.9+
python --version

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ml/requirements.txt
```

### Required Python Packages

```
# Core ML
lightgbm>=4.0.0
xgboost>=2.0.0
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0

# Database
psycopg2-binary>=2.9.0
sqlalchemy>=2.0.0

# Utilities
python-dotenv>=1.0.0
tqdm>=4.65.0

# Evaluation
matplotlib>=3.7.0
seaborn>=0.12.0

# Optional
shap>=0.42.0  # For feature importance
```

### Training Pipeline

```bash
# 1. Extract features from database
python ml/scripts/extract_features.py --start-date 2021-10-01 --end-date 2024-12-01

# 2. Train model
python ml/scripts/train.py \
  --model-type win_probability \
  --model-name lightgbm \
  --version v1.0.0

# 3. Evaluate model
python ml/scripts/evaluate.py \
  --model-id <model-id> \
  --test-data data/test_features.parquet

# 4. Generate predictions for upcoming games
python ml/scripts/predict.py \
  --model-id <model-id> \
  --date 2024-12-25
```

---

## Deployment Strategy

### Batch Prediction Pipeline

**Schedule**: Run daily at 6 AM ET (before morning lines)

```bash
# Cron job
0 6 * * * cd /path/to/Sports_AI/ml && python scripts/daily_predictions.py
```

**Pipeline Steps**:
1. Fetch upcoming games (next 7 days)
2. Extract latest features for each game
3. Load active model from registry
4. Generate predictions
5. Store in `MLPrediction` table
6. Update model performance metrics (after games complete)

### Model Versioning

**Registry Table** (`MLModel`):
- Tracks all trained models
- Stores metrics and metadata
- Enables rollback if new model underperforms

**Deployment Process**:
1. Train new model offline
2. Evaluate on validation set
3. If metrics improve, save to registry with status=EVALUATING
4. Run shadow predictions for 1 week
5. Compare to current model
6. If successful, promote to status=ACTIVE
7. Old model → status=DEPRECATED

### Safety Measures

1. **Monitoring**:
   - Track daily log loss and calibration
   - Alert if metrics degrade >10%
   - Monitor feature distribution drift

2. **Fallback**:
   - Keep previous model version active
   - Automatic rollback if new model fails
   - Manual override capability

3. **Data Validation**:
   - Check for missing features
   - Validate feature ranges
   - Ensure no data leakage

4. **Rate Limiting**:
   - Max predictions per day
   - Timeout for long-running inference
   - Resource usage caps

---

## Experiment Tracking

Use **MLflow** or simple database tracking:

```python
# Log experiment
experiment = {
    'model_type': 'win_probability',
    'features': feature_list,
    'hyperparameters': params,
    'val_log_loss': 0.623,
    'val_brier_score': 0.241,
    'val_accuracy': 0.652,
    'train_date': datetime.now(),
}

# Save to database
db.mlmodel.create(experiment)
```

---

## Ethical Considerations

1. **Not Betting Advice**: All predictions are for analytics/education
2. **Transparency**: Show model confidence and uncertainty
3. **Responsible Use**: Remind users this is simulated/analytical
4. **Bias Detection**: Monitor for demographic or matchup biases
5. **Privacy**: No personally identifiable player data

---

## Future Enhancements

### Short-term (Next 3 months)
- [ ] Implement ELO rating system
- [ ] Add injury impact estimation
- [ ] Build feature importance dashboard
- [ ] Add model explainability (SHAP values)

### Medium-term (6 months)
- [ ] Real-time predictions (in-game updates)
- [ ] Player-level models (points, rebounds, assists)
- [ ] Ensemble of multiple model types
- [ ] Automated retraining pipeline

### Long-term (1 year)
- [ ] Deep learning models (if data permits)
- [ ] Multi-sport unified model
- [ ] Transfer learning across leagues
- [ ] Causal inference for injuries/trades

---

## Resources

### Academic Papers
- "Predicting NBA Game Outcomes" - Loeffelholz et al.
- "Machine Learning for Sports Prediction" - Bunker & Thabtah
- "ELO Ratings for Sports Forecasting" - Silver, FiveThirtyEight

### Datasets
- Historical game data: [Sports Reference](https://www.sports-reference.com/)
- Advanced stats: [NBA Stats API](https://www.nba.com/stats/)
- Injury data: [ESPN Injury Report](https://www.espn.com/nba/injuries)

### Tools
- LightGBM: https://lightgbm.readthedocs.io/
- Scikit-learn: https://scikit-learn.org/
- MLflow: https://mlflow.org/

---

## Contact & Questions

For questions about the ML pipeline, see the main project README or documentation.

**Remember**: This is analytics only. Not betting advice or predictions for wagering.


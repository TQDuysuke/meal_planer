import React, { useState, useEffect } from 'react';
import './App.css';
import mealData from '../meal.json';
import { getTodaySeed, getSeededRandom } from './utils';
import { 
  Utensils, 
  Coffee, 
  Sunrise, 
  Moon, 
  ShoppingCart, 
  Calendar, 
  Flame,
  Info
} from 'lucide-react';

const formatItem = (str) => {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const quotes = [
  "Health is the crown on the well person's head that only the ill person can see.",
  "Eat clean to live green, lose weight to feel great!",
  "Your body is the only temple you have, take good care of it.",
  "Discipline in eating is the key to freedom.",
  "Every meal is an opportunity to nourish your body."
];

function App() {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'shopping'
  const [todayPlan, setTodayPlan] = useState(null);
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    const seed = getTodaySeed();
    const random = getSeededRandom(seed);
    
    // Pick a random day plan
    const dayIndex = Math.floor(random * mealData.days.length);
    setTodayPlan(mealData.days[dayIndex]);

    // Pick a random quote
    const quoteIndex = Math.floor(random * quotes.length);
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  if (!todayPlan) return null;

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate daily shopping list based on today's meals
  const calculateDailyShopping = () => {
    const items = {};
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    
    mealTypes.forEach(type => {
      todayPlan.meals[type].forEach(mealItem => {
        const key = mealItem.item;
        if (!items[key]) {
          items[key] = { 
            name: formatItem(key), 
            quantity: 0, 
            unit: mealItem.grams ? 'g' : 'pcs' 
          };
        }
        items[key].quantity += (mealItem.grams || mealItem.quantity || 0);
      });
    });
    
    return Object.values(items);
  };

  const dailyShoppingList = calculateDailyShopping();

  return (
    <div className="app-container">
      <header className="header">
        <div className="date-badge">{todayDate}</div>
        <h1>Meal Planner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Weight Loss Program - {mealData.target_calories_per_day} kcal</p>
      </header>

      {activeTab === 'plan' ? (
        <div className="fade-in">
          <div className="quote-card">
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', fontWeight: '500' }}>
              "{dailyQuote}"
            </p>
          </div>

          <div className="total-calories">
            <Flame size={20} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            <span>Target: {mealData.target_calories_per_day} kcal</span>
          </div>

          <MealSection 
            title="Breakfast" 
            icon={<Sunrise size={20} />} 
            items={todayPlan.meals.breakfast} 
          />
          
          <MealSection 
            title="Lunch" 
            icon={<Utensils size={20} />} 
            items={todayPlan.meals.lunch} 
          />
          
          <MealSection 
            title="Dinner" 
            icon={<Moon size={20} />} 
            items={todayPlan.meals.dinner} 
          />

          <div className="meal-card" style={{ marginTop: '2rem', background: 'var(--primary-light)', border: 'none' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Info size={24} color="var(--primary-dark)" />
              <div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Today's Notes</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', opacity: 0.8 }}>
                  High protein, lots of vegetables, boiled/steamed dishes, limit animal fats.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <h2 className="section-title">
            <ShoppingCart size={24} /> Daily Grocery List
          </h2>
          <div className="shopping-list">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Ingredients needed for today's meals:
            </p>
            {dailyShoppingList.map((item, idx) => (
              <div key={idx} className="shopping-item">
                <span>{item.name}</span>
                <span>
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Note: Quantities are based on the selected daily plan.
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          <Calendar size={24} />
          <span>Plan</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          <ShoppingCart size={24} />
          <span>Grocery</span>
        </div>
      </nav>
    </div>
  );
}

function MealSection({ title, icon, items }) {
  return (
    <div className="meal-section">
      <h3 className="section-title">
        {icon} {title}
      </h3>
      <div className="meal-card">
        {items.map((item, idx) => (
          <div key={idx} className="food-item">
            <span className="food-name">{formatItem(item.item)}</span>
            <span className="food-qty">
              {item.grams ? `${item.grams}g` : `${item.quantity} pcs`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

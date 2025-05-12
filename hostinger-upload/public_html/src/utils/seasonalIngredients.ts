export interface SeasonalIngredient {
  id: string;
  nameAr: string;
  nameTr: string;
  descriptionAr: string;
  descriptionTr: string;
  imageUrl: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_SEASONAL_INGREDIENTS: SeasonalIngredient[] = [
  {
    id: '1',
    nameAr: 'طماطم موسمية',
    nameTr: 'Mevsim Domatesi',
    descriptionAr: 'طماطم طازجة من مزارع محلية، غنية بالنكهة ومثالية للسلطات والأطباق الرئيسية',
    descriptionTr: 'Yerel çiftliklerden taze domates, lezzet açısından zengin ve salatalar ve ana yemekler için ideal',
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=500&auto=format&fit=crop',
    season: 'summer',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    nameAr: 'فطر بري',
    nameTr: 'Yabani Mantar',
    descriptionAr: 'فطر بري طازج ذو نكهة أرضية عميقة، يضيف عمقًا غنيًا للأطباق الموسمية',
    descriptionTr: 'Derin, topraksı lezzete sahip taze yabani mantarlar, mevsimlik yemeklere zengin bir derinlik katar',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop',
    season: 'autumn',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    nameAr: 'زعتر طازج',
    nameTr: 'Taze Kekik',
    descriptionAr: 'زعتر طازج مقطوف يدويًا مع نكهة عطرية قوية تميز الأطباق المتوسطية الأصيلة',
    descriptionTr: 'Elle toplanmış taze kekik, otantik Akdeniz yemeklerini tamamlayan güçlü aromatik lezzete sahiptir',
    imageUrl: 'https://images.unsplash.com/photo-1506807803488-8eafc07cfbc5?q=80&w=500&auto=format&fit=crop',
    season: 'spring',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    nameAr: 'كرنب أخضر',
    nameTr: 'Yeşil Lahana',
    descriptionAr: 'كرنب أخضر طازج غني بالفيتامينات، مثالي للأطباق الشتوية الدافئة',
    descriptionTr: 'Vitaminlerle dolu taze yeşil lahana, sıcak kış yemekleri için idealdir',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop',
    season: 'winter',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// LocalStorage key for seasonal ingredients
export const STORAGE_KEY = 'seasonalIngredients';

// Get all seasonal ingredients from localStorage or use defaults
export function getSeasonalIngredients(): SeasonalIngredient[] {
  try {
    const ingredients = localStorage.getItem(STORAGE_KEY);
    return ingredients ? JSON.parse(ingredients) : DEFAULT_SEASONAL_INGREDIENTS;
  } catch (error) {
    console.error('Error loading seasonal ingredients:', error);
    return DEFAULT_SEASONAL_INGREDIENTS;
  }
}

// Get active seasonal ingredients
export function getActiveSeasonalIngredients(): SeasonalIngredient[] {
  return getSeasonalIngredients().filter(item => item.isActive);
}

// Get current season's ingredients
export function getCurrentSeasonIngredients(): SeasonalIngredient[] {
  const currentMonth = new Date().getMonth();
  // 0-2: Winter, 3-5: Spring, 6-8: Summer, 9-11: Autumn
  let currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  
  if (currentMonth >= 2 && currentMonth <= 4) {
    currentSeason = 'spring';
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    currentSeason = 'summer';
  } else if (currentMonth >= 8 && currentMonth <= 10) {
    currentSeason = 'autumn';
  } else {
    currentSeason = 'winter';
  }
  
  return getActiveSeasonalIngredients().filter(item => item.season === currentSeason);
}

// Save seasonal ingredients to localStorage
export function saveSeasonalIngredients(ingredients: SeasonalIngredient[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    document.dispatchEvent(new CustomEvent('ingredientsUpdated'));
  } catch (error) {
    console.error('Error saving seasonal ingredients:', error);
  }
}

// Add a new seasonal ingredient
export function addSeasonalIngredient(ingredient: Omit<SeasonalIngredient, 'id' | 'createdAt'>): SeasonalIngredient {
  const ingredients = getSeasonalIngredients();
  const newIngredient: SeasonalIngredient = {
    ...ingredient,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  ingredients.push(newIngredient);
  saveSeasonalIngredients(ingredients);
  return newIngredient;
}

// Update a seasonal ingredient
export function updateSeasonalIngredient(id: string, updates: Partial<SeasonalIngredient>): SeasonalIngredient | undefined {
  const ingredients = getSeasonalIngredients();
  const index = ingredients.findIndex(item => item.id === id);
  
  if (index !== -1) {
    ingredients[index] = { ...ingredients[index], ...updates };
    saveSeasonalIngredients(ingredients);
    return ingredients[index];
  }
  
  return undefined;
}

// Delete a seasonal ingredient
export function deleteSeasonalIngredient(id: string): boolean {
  const ingredients = getSeasonalIngredients();
  const filteredIngredients = ingredients.filter(item => item.id !== id);
  
  if (filteredIngredients.length !== ingredients.length) {
    saveSeasonalIngredients(filteredIngredients);
    return true;
  }
  
  return false;
}

// Toggle ingredient active status
export function toggleIngredientActive(id: string): boolean {
  const ingredients = getSeasonalIngredients();
  const index = ingredients.findIndex(item => item.id === id);
  
  if (index !== -1) {
    ingredients[index].isActive = !ingredients[index].isActive;
    saveSeasonalIngredients(ingredients);
    return ingredients[index].isActive;
  }
  
  return false;
}
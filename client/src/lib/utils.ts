import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Restaurant stock images
export const restaurantImages = [
  {
    id: "hero-1",
    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80",
    alt: "Royal Restaurant Interior"
  },
  {
    id: "hero-2",
    url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80",
    alt: "Elegant Dining Setup"
  },
  {
    id: "hero-3",
    url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80",
    alt: "Traditional Middle Eastern Cuisine"
  },
  {
    id: "about",
    url: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    alt: "Royal Restaurant Atmosphere"
  }
];

// Restaurant menu stock images
export const menuItemImages = [
  {
    id: "menu-1",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Turkish Style Grilled Meat"
  },
  {
    id: "menu-2",
    url: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Hummus with Tahini"
  },
  {
    id: "menu-3",
    url: "https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg",
    alt: "Pistachio Baklava"
  },
  {
    id: "menu-4",
    url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Turkish Tea"
  },
  {
    id: "menu-5",
    url: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Iskender Kebab"
  },
  {
    id: "menu-6",
    url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Turkish Coffee"
  },
  {
    id: "special-1",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    alt: "Royal Mixed Grill Plate"
  },
  {
    id: "special-2",
    url: "https://images.unsplash.com/photo-1532597540419-b176991847e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    alt: "Seafood Platter"
  }
];

// API client functions
export const apiClient = {
  login: async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { authenticated: false, user: null };
    }
    
    // Handle mock token for development
    if (token === 'mock-admin-token') {
      return { 
        authenticated: true, 
        user: {
          id: 1,
          username: 'admin',
          isAdmin: true
        }
      };
    }
    
    try {
      const response = await fetch('/api/auth/check', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        return { authenticated: false, user: null };
      }
      
      const data = await response.json();
      return { authenticated: true, user: data.user };
    } catch (error) {
      localStorage.removeItem('token');
      return { authenticated: false, user: null };
    }
  },
  
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    
    // For mock token, still return headers that appear valid
    if (token === 'mock-admin-token') {
      return {
        'Authorization': `Bearer mock-admin-token`,
        'Content-Type': 'application/json',
      };
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(amount);
};

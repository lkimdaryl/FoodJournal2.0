import React, { useState, useEffect } from 'react';
import './Recipes.css';

interface pastaProps {
  img: string;
  label: string;
  url: string;
}
const Pasta: React.FC<pastaProps> = ({img, label, url}) => {
  return (
    <>
    <img className="weekly-pasta-img" src={img} alt={label} />
    <div className="recipe-info">
      <h3 className="weekly-pasta">{label}</h3>
      <p className="shallotPasta">Check out this pasta dish! If you don't like what we have to offer, feel free to refresh the page for a new pasta dish!</p>
      <a href={url} target='_blank'>View Recipe</a>
    </div>              
    </>
  )
};

interface recipeProps {
  uri: string;
  url: string;
  img: string;
  label: string;

}
const Recipe: React.FC<recipeProps> = ({uri, url, img, label}) => {
  return (
    <div key={uri} className="search-result">
      <img src={img} alt={label} />
      <div className="recipe-info">
        <h3>{label}</h3>
        <a href={url} target="_blank" rel="noopener noreferrer">
          View Recipe
        </a>
      </div>
    </div>
  )
};

export default function Recipes() {
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [error, setError] = useState<string | null>(null);
  const [pastaBank, setPastaBank] = useState<[]>([]);
  const [pastaOfTheWeek, setPastaOfTheWeek] = useState<any | null>();

  const applicationKey =  import.meta.env.VITE_APP_EDAMAM_API_KEY;
  const applicationId =  import.meta.env.VITE_APP_EDAMAM_API_ID;

  useEffect(() => {
    const getPasta = async() => {
      setLoading(true);
      setError(null);
      const url = `https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=${applicationId}&app_key=${applicationKey}`;
  
      try {
        const response = await fetch(url, {
          headers: {
            "Accept": "application/json",
            "Accept-Language": "en",
            "Edamam-Account-User": applicationId
          }
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        const data = await response.json();
        setPastaBank(data.hits);
      } catch (err) {
        console.log(`Failed to fetch recipes. Error: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    getPasta();
  }, [applicationId, applicationKey]);

  useEffect(() => {
    const selectPastaOfTheWeek = () => {
      if (pastaBank.length > 0) {
        const randomPasta = pastaBank[Math.floor(Math.random() * pastaBank.length)];
        setPastaOfTheWeek(randomPasta);
      }
    };

    selectPastaOfTheWeek();
  }, [pastaBank]);

  const searchRecipes = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${applicationId}&app_key=${applicationKey}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Accept-Language": "en",
          "Edamam-Account-User": applicationId
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setRecipes(data.hits);
    } catch (err: any) {
      setError(`Failed to fetch recipes. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipes-container jockey-one-regular">
      <div className="recipe-post-container">
        <div className="recipe-of-the-week reddit-sans-condensed">
          <h2>Recommended Pasta Recipe:</h2>
          <div className="recipe-card">
            { pastaOfTheWeek ? (
              <Pasta 
                img={pastaOfTheWeek.recipe.image} 
                label={pastaOfTheWeek.recipe.label} 
                url={pastaOfTheWeek.recipe.url} 
              />
            ) : <p>...Loading</p>
            }
          </div>
        </div>
        <div className="recipeSearch reddit-sans-condensed">
          <h1>Recipe Search</h1>
          <form onSubmit={searchRecipes} className="search-form">
            <div className="search-container">
              <input
                className="searchBox"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find new recipes..."
                required
              />
              <button type="submit" disabled={loading} className="searchButton">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          {error && <p>{error}</p>}
          <div className="recipes-grid">
            {recipes.map((recipeData: {recipe: any}) => (
              <Recipe 
                uri={recipeData.recipe.uri} 
                url={recipeData.recipe.url} 
                img={recipeData.recipe.image} 
                label={recipeData.recipe.label} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

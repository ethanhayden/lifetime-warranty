import React, { useState } from "react";
import { Search, ArrowLeft, Check, X, SortAsc } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/card";
import "./warranty-ratings.css";

const ScoreDisplay = ({ score, max }) => {
  const getColor = () => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "bg-green";
    if (percentage >= 50) return "bg-yellow";
    return "bg-red";
  };

  return (
    <span className={`score-display ${getColor()}`}>
      {score}/{max}
    </span>
  );
};

const CategoryTag = ({ category, onClick, isActive }) => {
  const categoryColors = {
    Outdoors: "bg-emerald",
    Luggage: "bg-violet",
    Clothing: "bg-sky",
    Other: "bg-amber",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(category);
      }}
      className={`${categoryColors[category] || "bg-gray"} ${
        isActive ? "ring" : ""
      }`}
    >
      {category}
    </button>
  );
};

const SortDropdown = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: "yearOldest", label: "Year Founded (Oldest First)" },
    { value: "yearNewest", label: "Year Founded (Newest First)" },
    { value: "scoreHigh", label: "Highest Score" },
    { value: "scoreLow", label: "Lowest Score" },
    { value: "nameAZ", label: "Name (A-Z)" },
    { value: "nameZA", label: "Name (Z-A)" },
  ];

  return (
    <div>
      <SortAsc />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const WarrantyRatings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortMethod, setSortMethod] = useState("yearOldest");

  const companies = [
    {
      name: "Patagonia",
      totalScore: 14,
      priceRange: "$$ - $$$",
      clarityTotal: 1,
      coverageTotal: 8,
      processTotal: 5,
      yearFounded: 1973,
      categories: ["Clothing", "Outdoors", "Luggage"],
    },
    {
      name: "Osprey",
      totalScore: 18,
      priceRange: "$$ - $$$",
      clarityTotal: 2,
      coverageTotal: 10,
      processTotal: 6,
      yearFounded: 1974,
      categories: ["Outdoors", "Luggage"],
    },
    {
      name: "Hydroflask",
      totalScore: 8,
      priceRange: "$ - $$",
      clarityTotal: 1,
      coverageTotal: 4,
      processTotal: 3,
      yearFounded: 2009,
      categories: ["Outdoors", "Other"],
    },
  ];

  const sortCompanies = (companies, method) => {
    switch (method) {
      case "yearOldest":
        return [...companies].sort((a, b) => a.yearFounded - b.yearFounded);
      case "yearNewest":
        return [...companies].sort((a, b) => b.yearFounded - a.yearFounded);
      case "scoreHigh":
        return [...companies].sort((a, b) => b.totalScore - a.totalScore);
      case "scoreLow":
        return [...companies].sort((a, b) => a.totalScore - b.totalScore);
      case "nameAZ":
        return [...companies].sort((a, b) => a.name.localeCompare(b.name));
      case "nameZA":
        return [...companies].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return companies;
    }
  };

  const filteredAndSortedCompanies = sortCompanies(
    companies.filter(
      (company) =>
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (!selectedCategory || company.categories.includes(selectedCategory))
    ),
    sortMethod
  );

  const allCategories = Array.from(
    new Set(companies.flatMap((company) => company.categories))
  ).sort();

  return (
    <div>
      <h1>Lifetime Warranty Ratings</h1>
      <div>
        <div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search companies..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search />
          </div>
          <SortDropdown currentSort={sortMethod} onSortChange={setSortMethod} />
        </div>

        <div className="category-tags">
          {allCategories.map((category) => (
            <CategoryTag
              key={category}
              category={category}
              onClick={(cat) =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              isActive={category === selectedCategory}
            />
          ))}
        </div>
      </div>

      <div>
        {filteredAndSortedCompanies.map((company) => (
          <Card key={company.name}>
            <CardHeader>
              <div>
                <div>
                  <CardTitle>{company.name}</CardTitle>
                  <div>Est. {company.yearFounded}</div>
                  <div className="category-tags">
                    {company.categories.map((cat) => (
                      <CategoryTag
                        key={cat}
                        category={cat}
                        onClick={(cat) =>
                          setSelectedCategory(
                            cat === selectedCategory ? null : cat
                          )
                        }
                        isActive={cat === selectedCategory}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div>{company.totalScore}/20</div>
                  <div>{company.priceRange}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="category-tags">
                <div>
                  <div>Clarity</div>
                  <ScoreDisplay score={company.clarityTotal} max={3} />
                </div>
                <div>
                  <div>Coverage</div>
                  <ScoreDisplay score={company.coverageTotal} max={10} />
                </div>
                <div>
                  <div>Process</div>
                  <ScoreDisplay score={company.processTotal} max={7} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WarrantyRatings;

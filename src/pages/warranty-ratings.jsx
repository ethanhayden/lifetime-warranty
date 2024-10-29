import React, { useState } from 'react';
import { Search, ArrowLeft, Check, X, SortAsc } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card';
import './warranty-ratings.css'

const ScoreDisplay = ({ score, max }) => {
  const getColor = () => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return 'bg-green-600 text-white';
    if (percentage >= 50) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <span className={`px-3 py-1 rounded inline-block text-center font-bold ${getColor()}`}>
      {score}/{max}
    </span>
  );
};

const CategoryTag = ({ category, onClick, isActive }) => {
  const categoryColors = {
    "Outdoors": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    "Luggage": "bg-violet-100 text-violet-800 hover:bg-violet-200",
    "Clothing": "bg-sky-100 text-sky-800 hover:bg-sky-200",
    "Other": "bg-amber-100 text-amber-800 hover:bg-amber-200"
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(category);
      }}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors
        ${categoryColors[category] || "bg-gray-100 text-gray-800"}
        ${isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
        overflow-hidden`}
      style={{ clipPath: 'inset(0 0 0 0 round 0.25rem)' }}
    >
      {category}
    </button>
  );
};

const SortDropdown = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'yearOldest', label: 'Year Founded (Oldest First)' },
    { value: 'yearNewest', label: 'Year Founded (Newest First)' },
    { value: 'scoreHigh', label: 'Highest Score' },
    { value: 'scoreLow', label: 'Lowest Score' },
    { value: 'nameAZ', label: 'Name (A-Z)' },
    { value: 'nameZA', label: 'Name (Z-A)' }
  ];

  return (
    <div className="flex items-center gap-2">
      <SortAsc className="w-5 h-5 text-gray-500" />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 border rounded bg-white"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const WarrantyRatings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortMethod, setSortMethod] = useState('yearOldest');

  const companies = [
    {
      name: "Patagonia",
      totalScore: 14,
      priceRange: "$$ - $$$",
      clarityTotal: 1,
      coverageTotal: 8,
      processTotal: 5,
      yearFounded: 1973,
      categories: ["Clothing", "Outdoors", "Luggage"]
    },
    {
      name: "Osprey",
      totalScore: 18,
      priceRange: "$$ - $$$",
      clarityTotal: 2,
      coverageTotal: 10,
      processTotal: 6,
      yearFounded: 1974,
      categories: ["Outdoors", "Luggage"]
    },
    {
      name: "Hydroflask",
      totalScore: 8,
      priceRange: "$ - $$",
      clarityTotal: 1,
      coverageTotal: 4,
      processTotal: 3,
      yearFounded: 2009,
      categories: ["Outdoors", "Other"]
    }
  ];

  const sortCompanies = (companies, method) => {
    switch (method) {
      case 'yearOldest':
        return [...companies].sort((a, b) => a.yearFounded - b.yearFounded);
      case 'yearNewest':
        return [...companies].sort((a, b) => b.yearFounded - a.yearFounded);
      case 'scoreHigh':
        return [...companies].sort((a, b) => b.totalScore - a.totalScore);
      case 'scoreLow':
        return [...companies].sort((a, b) => a.totalScore - b.totalScore);
      case 'nameAZ':
        return [...companies].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return [...companies].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return companies;
    }
  };

  const filteredAndSortedCompanies = sortCompanies(
    companies.filter(company =>
      (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!selectedCategory || company.categories.includes(selectedCategory))
    ),
    sortMethod
  );

  const allCategories = Array.from(
    new Set(companies.flatMap(company => company.categories))
  ).sort();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lifetime Warranty Ratings</h1>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full p-2 pl-10 border rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <SortDropdown currentSort={sortMethod} onSortChange={setSortMethod} />
        </div>

        <div className="flex flex-wrap gap-2">
          {allCategories.map(category => (
            <CategoryTag
              key={category}
              category={category}
              onClick={(cat) => setSelectedCategory(cat === selectedCategory ? null : cat)}
              isActive={category === selectedCategory}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {filteredAndSortedCompanies.map((company) => (
          <Card 
            key={company.name}
            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{company.name}</CardTitle>
                  <div className="text-sm text-gray-600 mb-2">
                    Est. {company.yearFounded}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.categories.map(cat => (
                      <CategoryTag
                        key={cat}
                        category={cat}
                        onClick={(cat) => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        isActive={cat === selectedCategory}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold mb-1">{company.totalScore}/20</div>
                  <div className="text-sm text-gray-600">{company.priceRange}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Clarity</div>
                  <ScoreDisplay score={company.clarityTotal} max={3} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Coverage</div>
                  <ScoreDisplay score={company.coverageTotal} max={10} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Process</div>
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

import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import '../../styles/mesaCategoryStyle.css';

const MesaCategory = ({ category, subCategories }) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  return (
    <div className="mesaCategory">
      <div className="mainCategory">{category}</div>
      {subCategories.map(sub => (
        <div
          key={sub.title}
          className={`subCategory ${selectedSubCategory === sub.title ? 'selected' : ''}`}
          onClick={() => setSelectedSubCategory(sub.title)}
        >
          {sub.text}
        </div>
      ))}
    </div>
  );
};

export default MesaCategory;

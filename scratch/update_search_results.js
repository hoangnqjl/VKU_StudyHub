const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/search-results.tsx', 'utf8');

code = code.replace(
  "import { Feather } from '@expo/vector-icons';",
  "import LucideIcon, { ChevronLeft, Search, X, SlidersHorizontal, Check, ChevronDown, ChevronRight, Home, Download, BookOpen, Bookmark, User } from '../components/DynamicLucideIcon';"
);

code = code.replace('<Feather name="chevron-left" size={z(25)} color={COLORS.title} />', '<ChevronLeft size={z(25)} color={COLORS.title} />');
code = code.replace('<Feather name="search" size={z(21)} color={COLORS.navy} />', '<Search size={z(21)} color={COLORS.navy} />');
code = code.replace('<Feather name="x" size={z(17)} color="#555B67" />', '<X size={z(17)} color="#555B67" />');
code = code.replace('<Feather name="filter" size={z(18)} color={COLORS.navy} />', '<SlidersHorizontal size={z(18)} color={COLORS.navy} />');
code = code.replace('<Feather name="check" size={z(15)} color={COLORS.white} />', '<Check size={z(15)} color={COLORS.white} />');
code = code.replace('<Feather name="chevron-down" size={z(16)} color={COLORS.title} />', '<ChevronDown size={z(16)} color={COLORS.title} />');
code = code.replace('<Feather name="search" size={z(27)} color="#9AAAC1" />', '<Search size={z(27)} color="#9AAAC1" />');
code = code.replace('<Feather name="home" size={z(17)} color={COLORS.navy} />', '<Home size={z(17)} color={COLORS.navy} />');
code = code.replace('<Feather name="download" size={z(17)} color={COLORS.white} />', '<Download size={z(17)} color={COLORS.white} />');
code = code.replace('<Feather name="book-open" size={z(19)} color={COLORS.navy} />', '<BookOpen size={z(19)} color={COLORS.navy} />');
code = code.replace('<Feather name="chevron-right" size={z(16)} color={COLORS.navy} />', '<ChevronRight size={z(16)} color={COLORS.navy} />');

code = code.replace(/<Feather\s+name="bookmark"[\s\S]*?\/>/, '<Bookmark size={z(17)} color={saved ? COLORS.white : COLORS.body} fill={saved ? COLORS.white : "none"} />');
code = code.replace(/<Feather\s+name=\{isFriend \? 'user' : 'book'\}[\s\S]*?\/>/, '{isFriend ? <User size={z(15)} color={COLORS.navy} /> : <BookOpen size={z(15)} color={COLORS.navy} />}');

fs.writeFileSync('frontend/src/app/search-results.tsx', code, 'utf8');
console.log('Successfully updated search-results.tsx');


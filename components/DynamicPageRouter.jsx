import { useParams, useLocation, Navigate } from 'react-router-dom';
import CompanyMultipage from './CompanyMultipage';
import CompanyDetail from './CompanyDetail';
import CompanyHome from './CompanyHome';

export default function DynamicPageRouter() {
  const { slug } = useParams();
  const location = useLocation();

  // Extract remaining path after slug
  const remainingPath = location.pathname.split('/').slice(2).join('/');

  // Case 1: /slug (home)
  if (!remainingPath) {
    return <CompanyHome />;
  }

  // Case 2: Check if path matches multipage formats
  const multipageFullMatch = /^([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(remainingPath);
  const multipageDistrictMatch = /^([^/]+)-([^/]+)$/.exec(remainingPath);

  if (multipageFullMatch) {
    const [ , itemSlug, stateSlug, districtSlug ] = multipageFullMatch;
    return <CompanyMultipage itemSlug={itemSlug} stateSlug={stateSlug} districtSlug={districtSlug} />;
  }

  if (multipageDistrictMatch) {
    const [ , itemSlug, districtSlug ] = multipageDistrictMatch;
    return <CompanyMultipage itemSlug={itemSlug} districtSlug={districtSlug} />;
  }

  // Case 3: Fallback to CompanyDetail
  const detailMatch = /^([^/]+)$/.exec(remainingPath);
  if (detailMatch) {
    const [ , itemSlug ] = detailMatch;
    return <CompanyDetail itemSlug={itemSlug} />;
  }

  // Case 4: Unknown pattern → 404
  return <Navigate href="/404" />;
}

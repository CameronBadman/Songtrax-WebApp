import { Outlet, Link } from "react-router-dom";
import Header from "../Header"

const Layout = () => {
  return (
    <Router>
      <div className="App">
        <Header></Header>
  
        <nav>
          <ul>
            {pages.map(page => (
              <li key={page.path}>
                <NavLink to={page.path} activeClassName="active" exact>{page.name}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
  
        <Routes>
          {pages.map(page => (
            <Route path={page.path} element={<Page title={page.name} content={page.text} />} />
          ))}
        </Routes>
  
        <footer>
          <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
};

export default Layout;
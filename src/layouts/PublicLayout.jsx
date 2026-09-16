import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import './PublicLayout.css'

function PublicLayout() {
  return (
    <div className="kentank-public-layout">

      <Navbar />

      <main className="kentank-public-main">
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}

export default PublicLayout
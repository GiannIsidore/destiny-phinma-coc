// import EventsAdmin from "./AdminEvents"
import ScholarsAdmin from "./AdminScholars"
import FeaturedBooks from "./FeaturedBooks"
import FeaturedEvents from "./FeaturedEvents"
import AdminFaqPage from "./AdminFaqPage"

const AdminPage = () => {
  return (
    <div>
      {/* <EventsAdmin/> */}
      <FeaturedEvents/>
      <ScholarsAdmin/>
      <FeaturedBooks/>
      <AdminFaqPage/>
    </div>
  )
}

export default AdminPage

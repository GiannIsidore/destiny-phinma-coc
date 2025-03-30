// import EventsAdmin from "./AdminEvents"
import ScholarsAdmin from "./AdminScholars"
import FeaturedBooks from "./FeaturedBooks"
import FeaturedEvents from "./FeaturedEvents"

const AdminPage = () => {
  return (
    <div>
      {/* <EventsAdmin/> */}
      <FeaturedEvents/>
      <ScholarsAdmin/>
      <FeaturedBooks/>
    </div>
  )
}

export default AdminPage

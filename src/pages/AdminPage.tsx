import EventsAdmin from "./AdminEvents"
import ScholarsAdmin from "./AdminScholars"
import FeaturedBooks from "./FeaturedBooks"

const AdminPage = () => {
  return (
    <div>
      <EventsAdmin/>
      <ScholarsAdmin/>
      <FeaturedBooks/>
    </div>
  )
}

export default AdminPage

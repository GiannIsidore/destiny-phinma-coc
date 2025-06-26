import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

export function MainContent() {
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="container mx-auto my-16 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={leftVariant}
        >
          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The Cagayan de Oro College Library is the central source of information throughout the academic community. The basic function is to support to the fullest extent possible the various curricula and programs of the College by providing print and non-print materials to meet the instructional, information and research needs of all its clienteles.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={rightVariant}
        >
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The mission of the COC-PHINMA Education Network Library is to provide quality and updated information resources and user-centered services that will sustain the instructional, research and extension programs of the academic community.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

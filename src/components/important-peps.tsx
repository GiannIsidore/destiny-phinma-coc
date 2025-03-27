/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import  { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SAProfile {
  id: string;
  name: string;
  course: string;
  month: string;
  imgurl: string;
  caption: string;
}

interface HKProfile {
  id: string;
  name: string;
  course: string;
  month: string;
  imgurl: string;
  caption: string;
}

const ProfileLayoutV2 = () => {
  const [saData, setSaData] = useState<SAProfile | null>(null);
  const [hkData, setHkData] = useState<HKProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSA = async () => {
      try {
        const { data, error } = await supabase
          .from('sa')
          .select('*')
          .order('created_at', { ascending: false }) // Order by created_at descending to get the latest entry
          .limit(1); // Limit to the latest entry only

        if (error) throw error;

        if (data?.length > 0) {
          setSaData(data[0]); // Set the latest entry
        } else {
          setError('No Student Assistant data found');
        }
      } catch (err) {
        setError('Failed to fetch Student Assistant data');
        toast.error('Failed to load Student Assistant data');
      }
    };

    const fetchHK = async () => {
      try {
        const { data, error } = await supabase
          .from('hk')
          .select('*')
          .order('created_at', { ascending: false }) // Order by created_at descending to get the latest entry
          .limit(1); // Limit to the latest entry only

        if (error) throw error;

        if (data?.length > 0) {
          setHkData(data[0]); // Set the latest entry
        } else {
          setError('No Hawak Kamay Scholar data found');
        }

      } catch (err) {
        setError('Failed to fetch Hawak Kamay Scholar data');
        toast.error('Failed to load Hawak Kamay Scholar data');
      } finally {
        setLoading(false);
      }
    };

    fetchSA();
    fetchHK();
  }, []);



  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="w-full h-[130vh] bg-primary-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[130vh] bg-primary-900 flex justify-center items-center">
        <p className="text-white text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 container mx-auto px-4 py-8">
        <Tabs defaultValue="assistant" className="w-full">
          <TabsList className="flex justify-center gap-4 bg-transparent text-white mb-8">
            <TabsTrigger value="assistant">Student Assistant</TabsTrigger>
            <TabsTrigger value="hawak">Hawak Kamay Scholar</TabsTrigger>
          </TabsList>

          {/* Student Assistant Tab */}
          <TabsContent value="assistant" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center">
                {saData ? (
                  <>
                    <img
                      src={saData.imgurl}
                      alt="Profile"
                      className="object-cover rounded-full"
                      width={400}
                      height={400}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-xl font-semibold text-white">{saData.name}</p>
                      <p className="text-lg text-white">{saData.course}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-white">No Student Assistant selected for this month</p>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-4 text-white">
                  {`Student Assistant of the Month (${month} ${year})`}
                </h1>
                <p className="text-lg text-white">
                  {saData?.caption || "No description available"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Hawak Kamay Scholar Tab */}
          <TabsContent value="hawak" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-4 text-white">
                  {`Hawak Kamay Scholar of the Month (${month} ${year})`}
                </h1>
                <p className="text-lg text-white">
                  {hkData?.caption || "No description available"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                {hkData ? (
                  <>
                    <img
                      src={hkData.imgurl}
                      alt="Profile"
                      className="object-cover rounded-full"
                      width={400}
                      height={400}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-xl font-semibold text-white">{hkData.name}</p>
                      <p className="text-lg text-white">{hkData.course}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-white">No Hawak Kamay Scholar selected for this month</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileLayoutV2;

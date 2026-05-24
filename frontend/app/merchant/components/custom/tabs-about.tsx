import AC from "@/components/icons/ac";
import Cart from "@/components/icons/cart";
import Forkify from "@/components/icons/forkify";
import Parking from "@/components/icons/parking";
import Ride from "@/components/icons/ride";
import Wifi from "@/components/icons/wifi";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

type TabsIcon = {
  icon: React.ReactElement;
  text: string;
};

const tabIcons: TabsIcon[] = [
  { icon: <Wifi />, text: "Free WiFi" },
  { icon: <Parking />, text: "Parkir Luas" },
  { icon: <AC />, text: "AC" },
  { icon: <Forkify />, text: "Makan di Tempat" },
  { icon: <Ride />, text: "Di Antar" },
  { icon: <Cart />, text: "Ambil di tempat" },
];

type JamOperasional = {
  day: string;
  hours: string;
};

const jamOperasional: JamOperasional[] = [
  { day: "Senin - Jumat", hours: "08.00 - 21.00" },
  { day: "Sabtu", hours: "08.00 - 22.00" },
  { day: "Minggu", hours: "09.00 - 20.00" },
];

const TabsAbout = ({ maps }: { maps?: string | null }) => {
  return (
    <TabsContent value="abouts" className="space-y-7.5">
      <Card>
        <CardContent>
          <h1 className="lg:text-lg text-base font-bold">Tentang Kami</h1>
          <p className="lg:text-lg font-semibold text-[#8D8D8D]">
            Warung makan dengan menu masakan rumahan yang lezat dan harga
            terjangkau. Kami menyajikan berbagai menu nasi, lauk pauk, sayur,
            dan minuman segar. Semua masakan dibuat dengan bahan-bahan
            berkualitas dan bumbu tradisional yang khas.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {maps ? (
            <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
              <iframe
                src={maps}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Lokasi belum tersedia.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h1 className="lg:text-lg text-base font-bold">
            Fasilitas & Layanan
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {tabIcons.map((tab, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#D9E7DD] bg-[#F5FBF7] h-[124px] px-[30px] py-[20px]"
              >
                {tab.icon}
                <p className="text-[#2B2B2B] font-medium text-base text-center">
                  {tab.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h1 className="lg:text-lg text-base font-bold">Jam Operasional</h1>
          <div className="space-y-5 mt-5 ">
            {jamOperasional.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-5 px-5 bg-[#F9FAFB] rounded-lg"
              >
                <h1 className="text-[#8D8D8D] lg:text-lg font-medium">
                  {item.day}
                </h1>
                <p className="text-[#333] lg:text-lg font-semibold">
                  {item.hours}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TabsAbout;

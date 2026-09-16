import Image from "next/image";
import Link from "next/link";
import {
	Accessibility,
	Car,
	HeartHandshake,
	Hospital,
	Handshake,
	MapPinned,
	Search,
	Stethoscope,
	UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

type ServiceType = { id: string; name: string; icon_name: string | null };

const iconByName: Record<string, LucideIcon> = {
	accessibility: Accessibility,
	car: Car,
	hospital: Hospital,
	medical: Stethoscope,
	stethoscope: Stethoscope,
	user: UserRound,
};

const steps = [
	{ number: "01", title: "ค้นหา", description: "บอกความต้องการและเลือกบริการที่เหมาะกับคุณ", icon: Search },
	{ number: "02", title: "จับคู่", description: "พบผู้ช่วยที่มีประสบการณ์และตรงกับความต้องการ", icon: Handshake },
	{ number: "03", title: "เดินทาง", description: "ออกเดินทางอย่างสบายใจ พร้อมคนดูแลตลอดเส้นทาง", icon: MapPinned },
];

async function getServiceTypes(): Promise<ServiceType[]> {
	const supabase = await createClient();
	const { data } = await supabase.from("service_types").select("id, name, icon_name").order("name");
	return (data ?? []) as ServiceType[];
}

export default async function HomePage() {
	const serviceTypes = await getServiceTypes();

	return (
		<div className="flex min-h-screen flex-col bg-[#FAFAF8]">
			<Navbar />
			<main>
				{/* HERO */}
				<section className="relative overflow-hidden">
					{/* decorative background blobs */}
					<div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#F5A65B]/20 blur-3xl" />
					<div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-[#1F8F73]/10 blur-3xl" />

					<div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-28">
						<div className="order-2 lg:order-1">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#1F8F73]/10 px-4 py-2 text-sm font-bold text-[#1F8F73]">
								<HeartHandshake size={18} strokeWidth={2.2} aria-hidden="true" />
								เดินทางอย่างอุ่นใจ
							</div>
							<h1 className="max-w-2xl text-5xl font-extrabold leading-[1.1] tracking-tight text-[#2E2E2E] sm:text-6xl lg:text-7xl">
								Care <span className="text-[#1F8F73]">Companion</span>
							</h1>
							<p className="mt-6 max-w-xl text-lg leading-relaxed text-[#2E2E2E]/70 sm:text-xl">
								แพลตฟอร์มจับคู่ผู้ช่วยเดินทางที่ไว้ใจได้ เพื่อให้ทุกการเดินทางของคุณและคนที่คุณรักง่ายและปลอดภัยยิ่งขึ้น
							</p>
							<div className="mt-9 flex flex-col gap-4 sm:flex-row">
								<Link href="/login">
									<Button className="w-full shadow-lg shadow-[#1F8F73]/20 sm:w-auto">
										เริ่มต้นใช้งาน <MapPinned size={22} strokeWidth={2} aria-hidden="true" />
									</Button>
								</Link>
								<Link href="#how-it-works">
									<Button variant="outline" className="w-full sm:w-auto">
										ดูวิธีการใช้งาน
									</Button>
								</Link>
							</div>

							{/* small trust row */}
							<div className="mt-10 flex items-center gap-3 text-sm text-[#2E2E2E]/60">
								<div className="flex -space-x-2">
									<span className="h-8 w-8 rounded-full border-2 border-[#FAFAF8] bg-[#1F8F73]/20" />
									<span className="h-8 w-8 rounded-full border-2 border-[#FAFAF8] bg-[#F5A65B]/30" />
									<span className="h-8 w-8 rounded-full border-2 border-[#FAFAF8] bg-[#1F8F73]/30" />
								</div>
								ผู้ช่วยที่ผ่านการคัดกรองแล้ว พร้อมดูแลทุกการเดินทาง
							</div>
						</div>

						<div className="relative order-1 lg:order-2">
							<div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#F5A65B]/30 shadow-2xl shadow-[#2E2E2E]/10 lg:aspect-square">
								<Image
									 src="/images/illustrations/hero-landing.svg.svg"
									alt="ผู้สูงอายุเดินทางพร้อมผู้ช่วย"
									fill
									className="object-cover"
									priority
								/>
							</div>
							{/* floating accent illustration */}
						
						</div>
					</div>
				</section>

				{/* HOW IT WORKS */}
				<section id="how-it-works" className="bg-[#1F8F73] px-5 py-16 text-[#FAFAF8] sm:py-24">
					<div className="mx-auto max-w-7xl">
						<div className="mb-12 max-w-2xl">
							<p className="font-bold text-[#F5A65B]">เริ่มต้นได้ง่าย</p>
							<h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">3 ขั้นตอนสู่การเดินทางที่มั่นใจ</h2>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							{steps.map(({ number, title, description, icon: Icon }) => (
								<Card
									key={number}
									className="border-0 bg-[#FAFAF8] transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
								>
									<div className="flex items-center justify-between">
										<span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F8F73]/10">
											<Icon className="text-[#1F8F73]" size={26} strokeWidth={2} aria-hidden="true" />
										</span>
										<span className="text-4xl font-extrabold text-[#F5A65B]">{number}</span>
									</div>
									<h3 className="mt-7 text-2xl font-extrabold text-[#2E2E2E]">{title}</h3>
									<p className="mt-3 leading-relaxed text-[#2E2E2E]/75">{description}</p>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* SERVICES */}
				<section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
					<div className="mb-10 flex items-end justify-between gap-5">
						<div>
							<p className="font-bold text-[#1F8F73]">บริการของเรา</p>
							<h2 className="mt-2 text-3xl font-extrabold text-[#2E2E2E] sm:text-4xl">ช่วยให้ธุระสำคัญเป็นเรื่องง่าย</h2>
						</div>
					</div>
					{serviceTypes.length > 0 ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{serviceTypes.map((service) => {
								const ServiceIcon: LucideIcon = service.icon_name
									? iconByName[service.icon_name.toLowerCase()] ?? HeartHandshake
									: HeartHandshake;
								return (
									<Card
										key={service.id}
										className="flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
									>
										<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1F8F73]/10">
											<ServiceIcon className="text-[#1F8F73]" size={28} strokeWidth={2} aria-hidden="true" />
										</span>
										<h3 className="font-bold text-[#2E2E2E]">{service.name}</h3>
									</Card>
								);
							})}
						</div>
					) : (
						<Card>
							<p className="text-[#2E2E2E]/75">กำลังเตรียมบริการสำหรับคุณ</p>
						</Card>
					)}
				</section>
			</main>
			<Footer />
		</div>
	);
}
// ZAP usa o mesmo schema do VivaReal — feeds são aceitos no mesmo
// formato XML (`VRSync.xsd`). Mantemos uma rota separada para que
// cada portal tenha sua própria URL pública.
export { GET } from "@/app/api/feeds/vivareal/route";

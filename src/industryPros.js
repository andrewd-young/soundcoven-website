import image1 from "./assets/pro-image-1.jpg";
import image2 from "./assets/pro-image-2.jpg";
import image3 from "./assets/pro-image-3.jpg";
import image4 from "./assets/pro-image-4.jpg";

const industryPros = [
    {
      id: 1,
      name: "Jessica Harper",
      role: "Talent Manager",
      company: "Harper Talent Group",
      image : image1,
      location: "Los Angeles, CA",
      email: "jessica@harpertalent.com",
      phone: "555-123-4567",
      expertise: ["Indie Rock", "Pop", "Electronic"],
      notableClients: ["Band A", "Artist B"],
    },
    {
      id: 2,
      name: "Daniel Kim",
      role: "Booking Agent",
      company: "Prime Bookings",
      image : image2,
      location: "New York, NY",
      email: "daniel.kim@primebookings.com",
      phone: "555-987-6543",
      expertise: ["Jazz", "Classical", "World Music"],
      notableVenues: ["Carnegie Hall", "Blue Note"],
    },
    {
      id: 3,
      name: "Sophia Ramirez",
      role: "Publicist",
      company: "Ramirez PR",
      image : image3,
      location: "Austin, TX",
      email: "sophia@ramirezpr.com",
      phone: "555-456-7890",
      expertise: ["Social Media Campaigns", "Press Releases"],
      successfulCampaigns: ["Artist X's Album Launch", "Music Festival Y"],
    },
    {
      id: 4,
      name: "Liam Chen",
      role: "Venue Buyer",
      company: "Live City Venues",
      image : image4,
      location: "Chicago, IL",
      email: "liam.chen@livecityvenues.com",
      phone: "555-321-0987",
      expertise: ["Large Scale Events", "Pop & Hip-Hop"],
      managedVenues: ["Arena Z", "The Grand Theater"],
    },
  ];
  
  export default industryPros;
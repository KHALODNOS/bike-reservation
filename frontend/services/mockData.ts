import { Bike } from '../types';

export const MOCK_BIKES: Bike[] = [
  {
    id: 1,
    title: "Mountain Explorer",
    type: "VTT",
    city: "Montreal",
    price: 25,
    image: "https://contents.mediadecathlon.com/p2623171/k$9d17c556d9d2e6d0f0da3770060d5191/velo-vtt-electrique-semi-rigide-275quote-e-st-100-blanc-rouge.jpg"
  },
  {
    id: 2,
    title: "City Cruiser",
    type: "City",
    city: "Toronto",
    price: 18,
    image: "https://contents.mediadecathlon.com/p2623157/k$56a387f834df8816d5aabd60fd676bba/velo-vtt-randonnee-expl-500-noir-29.jpg"
  },
  {
    id: 3,
    title: "E-Ride 500",
    type: "Electric",
    city: "Vancouver",
    price: 35,
    image: "https://contents.mediadecathlon.com/p2968364/k$89986b2a474e442a3863429a212cd401/velo-vtt-randonnee-st-120-noir-bleu-275.jpg"
  },
  {
    id: 4,
    title: "Urban Commuter",
    type: "City",
    city: "Calgary",
    price: 20,
    image: "https://contents.mediadecathlon.com/p2623181/k$761727051bc8134ff80c48ab70e246fc/velo-vtt-electrique-semi-rigide-275-e-st-500-noir.jpg"
  },
  {
    id: 5,
    title: "Trail Blazer",
    type: "VTT",
    city: "Ottawa",
    price: 30,
    image: "https://contents.mediadecathlon.com/p2878705/k$310f58f33adbc88311e26f6d5e4ff1df/velo-tout-chemin-electrique-cadre-bas-e-actv-100-gris-perle.jpg0"
  },
  {
    id: 6,
    title: "Eco E-Bike",
    type: "Electric",
    city: "Quebec City",
    price: 40,
    image: "https://contents.mediadecathlon.com/p2878753/k$f41ab4df874b332eeb9b08652441776c/velo-tout-chemin-electrique-cadre-haut-e-actv-100-gris-anthracite.jpg"
  },
  {
    id: 7,
    title: "Speedster X",
    type: "VTT",
    city: "Montreal",
    price: 28,
    image: "https://contents.mediadecathlon.com/p2069439/k$74d45f38847c3869603e41f236782b41/velo-tout-chemin-riverside-120-enjambement-bas-vert-pastel.jpg"
  },
  {
    id: 8,
    title: "Downtown Flow",
    type: "City",
    city: "Toronto",
    price: 15,
    image: "https://contents.mediadecathlon.com/p2878753/k$f41ab4df874b332eeb9b08652441776c/velo-tout-chemin-electrique-cadre-haut-e-actv-100-gris-anthracite.jpg"
  }
];

export const CITIES = ['All Cities', 'Montreal', 'Toronto', 'Vancouver', 'Calgary', 'Ottawa', 'Quebec City'];
export const TYPES = ['All', 'VTT', 'City', 'Electric'];
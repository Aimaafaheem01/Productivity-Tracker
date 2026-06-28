import {
  Droplet, Dumbbell, BookOpen, Moon, Sun, Apple,
  Pencil, Heart, Brain, Music, Coffee, Bike,
  Footprints, Smile, CheckCircle,
} from "lucide-react";

const iconRules = [
  { keywords: ["water", "drink", "hydrate"], icon: Droplet },
  { keywords: ["gym", "workout", "exercise", "lift", "weight"], icon: Dumbbell },
  { keywords: ["read", "book", "study"], icon: BookOpen },
  { keywords: ["sleep", "bed", "rest", "nap"], icon: Moon },
  { keywords: ["wake", "morning", "sunrise"], icon: Sun },
  { keywords: ["eat", "fruit", "diet", "healthy", "food"], icon: Apple },
  { keywords: ["write", "journal", "diary"], icon: Pencil },
  { keywords: ["meditat", "breath", "mindful"], icon: Brain },
  { keywords: ["love", "gratitude", "thank"], icon: Heart },
  { keywords: ["music", "guitar", "piano", "sing"], icon: Music },
  { keywords: ["coffee", "tea"], icon: Coffee },
  { keywords: ["bike", "cycle", "cycling"], icon: Bike },
  { keywords: ["walk", "run", "jog", "steps"], icon: Footprints },
  { keywords: ["smile", "happy", "mood"], icon: Smile },
];

export function getHabitIcon(name = "") {
  const lower = name.toLowerCase();
  const match = iconRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword))
  );
  return match ? match.icon : CheckCircle;
}
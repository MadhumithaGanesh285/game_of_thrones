export const normalizeFamilyName = (family: string | null, fullName: string): string => {
    if (!family || family.toLowerCase() === "none") return fullName;

    const cleanFamily = family.trim().toLowerCase().replace(/^house\s+/, ''); // Normalize input

    const familyMappings: Record<string, string> = {
        "stark": "House Stark",
        "lannister": "House Lannister",
        "lanister": "House Lannister",
        "targaryan": "House Targaryen",
        "targaryen": "House Targaryen",
        "baratheon": "House Baratheon",
        "unknown": fullName,
        "unkown": fullName,
        "": fullName,
        "none": fullName,
        "bolton": "House Bolton",
        "greyjoy": "House Greyjoy",
        "lorath": "House Lorathi",
        "lorathi": "House Lorathi"
    };

    return familyMappings[cleanFamily] || family;
};

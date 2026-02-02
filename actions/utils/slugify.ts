export default function slugify(input: string): string {
    return input
        .normalize("NFD")                   // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, "")    // Remove diacritical marks
        .toLowerCase()                      // Convert to lowercase
        .trim()                             // Trim whitespace
        .replace(/\s+/g, "-")              // Replace multiple spaces with a single dash
        .replace(/[^a-z0-9-]/g, "");       // Remove all non-alphanumeric and non-dash characters
}
import { FlatProblem } from "../models/AllSyllabus";

export class ProblemUtils {
    static getUniqueDifficulties(problems: FlatProblem[]): string[] {
        return [...new Set(problems.map(p => p.difficulty))]
            .sort((a, b) => a.localeCompare(b));
    }

    static getUniqueCategoryNames(problems: FlatProblem[]): string[] {
        const uniqueNames = new Set<string>();
        problems.forEach(p => {
            uniqueNames.add(p.category_name);
        });
        return Array.from(uniqueNames);
    }

    static getUniqueCategoryPairs(problems: FlatProblem[]): { slug: string; name: string }[] {
        const unique = new Map<string, { slug: string; name: string }>();
        problems.forEach(p => {
            unique.set(p.category_slug, {
                slug: p.category_slug,
                name: p.category_name
            });
        });
        return Array.from(unique.values());
    }

    static getUniqueSubCategoryNames(problems: FlatProblem[]): string[] {
        const uniqueNames = new Set<string>();
        problems.forEach(p => {
            uniqueNames.add(p.subcategory_name);
        });
        return Array.from(uniqueNames);
    }


    static getUniqueSubcategoryPairs(problems: FlatProblem[]): { slug: string; name: string }[] {
        const unique = new Map<string, { slug: string; name: string }>();
        problems.forEach(p => {
            unique.set(p.subcategory_slug, {
                slug: p.subcategory_slug,
                name: p.subcategory_name
            });
        });
        return Array.from(unique.values());
    }

    static getUniqueTags(problems: FlatProblem[]): string[] {
        return [...new Set(problems.flatMap(p => p.tags))].sort((a, b) => a.localeCompare(b));
    }
}

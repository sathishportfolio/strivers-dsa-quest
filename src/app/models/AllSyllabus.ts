// Updated Interfaces
export interface AllSyllabus {
    all_syllabus: IAllSyllabus;
}

export interface IAllSyllabus {
    all_syllabus: Category[];
    isCoreSubject: number;
}

export interface Category {
    category_id: string;
    category_name: string;
    category_slug: string;
    category_rank: number;
    subcategories: Subcategory[];
}

export interface Subcategory {
    subcategory_id: string;
    subcategory_name: string;
    subcategory_slug: string;
    subcategory_rank: number;
    subcategory_type: string;
    problems: Problem[];
}

export interface Problem {
    problem_id: string;
    problem_name: string;
    problem_slug: string;
    problem_rank: number;
    misc?: Misc | string | null;
    problem_type: string;
    hasIDE: boolean;
}

export interface Misc {
    tags?: string[];
    facts?: string;
    hints?: Hint[];
    language?: string[];
    difficulty?: string;
    frequently_occuring_doubts?: Doubt[];
    interview_followup_questions?: InterviewFollowup[];
}

export interface Hint {
    hint: string;
}

export interface Doubt {
    question: string;
    answer: string;
}

export interface InterviewFollowup {
    question: string;
    answer: string;
}

export interface FlatProblem {
    category_id: string;
    category_name: string;
    category_slug: string;
    category_rank: number;
    subcategory_id: string;
    subcategory_name: string;
    subcategory_slug: string;
    subcategory_rank: number;
    subcategory_type: string;
    problem_id: string;
    problem_name: string;
    problem_slug: string;
    problem_rank: number;
    tags: string[];
    facts: string;
    hints: string[];
    language: string[];
    difficulty: string;
    frequently_occuring_doubts: Doubt[];
    interview_followup_questions: InterviewFollowup[];
    problem_type: string;
    hasIDE: boolean;
}

// Data Transformation Utility
export class ProblemFlattener {

    static flatten(allSyllabus: AllSyllabus): FlatProblem[] {
        return allSyllabus.all_syllabus.all_syllabus.flatMap(category =>
            category.subcategories.flatMap(subcategory =>
                subcategory.problems.map(problem => {
                    // Handle misc property (string | Misc | null)
                    const misc = problem.misc;

                    return {
                        // Category Data
                        category_id: category.category_id,
                        category_name: category.category_name,
                        category_slug: category.category_slug,
                        category_rank: category.category_rank,

                        // Subcategory Data
                        subcategory_id: subcategory.subcategory_id,
                        subcategory_name: subcategory.subcategory_name,
                        subcategory_slug: subcategory.subcategory_slug,
                        subcategory_rank: subcategory.subcategory_rank,
                        subcategory_type: subcategory.subcategory_type,

                        // Problem Data
                        problem_id: problem.problem_id,
                        problem_name: problem.problem_name,
                        problem_slug: problem.problem_slug,
                        problem_rank: problem.problem_rank,
                        problem_type: problem.problem_type,
                        hasIDE: problem.hasIDE,

                        // Handle misc properties (with fallbacks)
                        tags: this.getTags(misc),
                        facts: this.getFacts(misc),
                        hints: this.getHints(misc),
                        language: this.getLanguage(misc),
                        difficulty: this.getDifficulty(misc),
                        frequently_occuring_doubts: this.getDoubts(misc),
                        interview_followup_questions: this.getInterviewQuestions(misc)
                    };
                })
            )
        );
    }

    static flattenAndFilter(
        searchTerm: string,
        allSyllabus: AllSyllabus,
        selectedDifficultyChips: string[],
        selectedCategorychips: string[],
        selectedSubCatgoryChips: string[],
        selectedTagsChips: string[],
        sortBy: string,
        order: string
    ): FlatProblem[] {
        const flatProblems = allSyllabus.all_syllabus.all_syllabus.flatMap(category =>
            category.subcategories.flatMap(subcategory =>
                subcategory.problems
                    .map(problem => {
                        const misc = problem.misc;

                        return {
                            // Category Data
                            category_id: category.category_id,
                            category_name: category.category_name,
                            category_slug: category.category_slug,
                            category_rank: category.category_rank,

                            // Subcategory Data
                            subcategory_id: subcategory.subcategory_id,
                            subcategory_name: subcategory.subcategory_name,
                            subcategory_slug: subcategory.subcategory_slug,
                            subcategory_rank: subcategory.subcategory_rank,
                            subcategory_type: subcategory.subcategory_type,

                            // Problem Data
                            problem_id: problem.problem_id,
                            problem_name: problem.problem_name,
                            problem_slug: problem.problem_slug,
                            problem_rank: problem.problem_rank,
                            problem_type: problem.problem_type,
                            hasIDE: problem.hasIDE,

                            // Misc properties
                            tags: this.getTags(misc) || [],
                            facts: this.getFacts(misc),
                            hints: this.getHints(misc),
                            language: this.getLanguage(misc),
                            difficulty: this.getDifficulty(misc),
                            frequently_occuring_doubts: this.getDoubts(misc),
                            interview_followup_questions: this.getInterviewQuestions(misc)
                        };
                    })
                    .filter(problem => {
                        // If all filter arrays are empty, include all problems
                        // const noFilters =
                        //     selectedDifficultyChips.length === 0 &&
                        //     selectedCategorychips.length === 0 &&
                        //     selectedSubCatgoryChips.length === 0 &&
                        //     selectedTagsChips.length === 0;

                        // if (noFilters) return true;

                        // // Check each filter separately (OR condition)
                        // const matchesDifficulty =
                        //     selectedDifficultyChips.length === 0 || selectedDifficultyChips.includes(problem.difficulty);

                        // const matchesCategory =
                        //     selectedCategorychips.length === 0 ||
                        //     selectedCategorychips.includes(problem.category_id) ||
                        //     selectedCategorychips.includes(problem.category_name);

                        // const matchesSubcategory =
                        //     selectedSubCatgoryChips.length === 0 ||
                        //     selectedSubCatgoryChips.includes(problem.subcategory_id) ||
                        //     selectedSubCatgoryChips.includes(problem.subcategory_name);

                        // const matchesTags =
                        //     selectedTagsChips.length === 0 ||
                        //     selectedTagsChips.some(tag => problem.tags.includes(tag));

                        // // Return true if problem matches any one of the filters (OR)
                        // debugger
                        // return matchesDifficulty || matchesCategory || matchesSubcategory || matchesTags;

                        // Filter by difficulty chips
                        if (selectedDifficultyChips.length > 0 && !selectedDifficultyChips.includes(problem.difficulty)) {
                            return false;
                        }

                        // Filter by category chips (assuming category_id or category_name)
                        if (selectedCategorychips.length > 0 && !selectedCategorychips.includes(problem.category_id) && !selectedCategorychips.includes(problem.category_name)) {
                            return false;
                        }

                        // Filter by subcategory chips (subcategory_id or subcategory_name)
                        if (selectedSubCatgoryChips.length > 0 && !selectedSubCatgoryChips.includes(problem.subcategory_id) && !selectedSubCatgoryChips.includes(problem.subcategory_name)) {
                            return false;
                        }

                        // Filter by tags — check if problem.tags contains all selected tags
                        if (selectedTagsChips.length > 0) {
                            if (!problem.tags || !selectedTagsChips.every(tag => problem.tags.includes(tag))) {
                                return false;
                            }
                        }

                        return true;
                    })
                    .filter(problem => {
                        const term = searchTerm.trim().toLowerCase();
                        const words = term.split(/\s+/); // Split by whitespace

                        // Combine searchable fields into one string for easier matching
                        const searchable = [
                            problem.problem_id,
                            problem.problem_name,
                            problem.problem_slug
                        ].join(' ').toLowerCase();

                        // Check if every word is present in the searchable string
                        return words.every(word => searchable.includes(word));
                    })
            )
        );

        // Sorting helper
        // const sortedProblems = flatProblems.sort((a, b) => {
        //     const aVal = a[sortBy];
        //     const bVal = b[sortBy];

        //     if (aVal === undefined || bVal === undefined) return 0;

        //     // Handle string comparison
        //     if (typeof aVal === 'string' && typeof bVal === 'string') {
        //         if (order === 'asc') return aVal.localeCompare(bVal);
        //         else return bVal.localeCompare(aVal);
        //     }

        //     // Handle number comparison
        //     if (typeof aVal === 'number' && typeof bVal === 'number') {
        //         if (order === 'asc') return aVal - bVal;
        //         else return bVal - aVal;
        //     }

        //     return 0;
        // });

        return flatProblems;
    }


    // static flatten(allSyllabus: AllSyllabus, selectedDifficultyChips: string[], selectedCategorychips: string[], selectedSubCatgoryChips: string[], selectedTagsChips: string[], sortBy: string, order: string): FlatProblem[] {
    //     return allSyllabus.all_syllabus.all_syllabus.flatMap(category =>
    //         category.subcategories.flatMap(subcategory =>
    //             subcategory.problems.map(problem => {
    //                 // Handle misc property (string | Misc | null)
    //                 const misc = problem.misc;

    //                 return {
    //                     // Category Data
    //                     category_id: category.category_id,
    //                     category_name: category.category_name,
    //                     category_slug: category.category_slug,
    //                     category_rank: category.category_rank,

    //                     // Subcategory Data
    //                     subcategory_id: subcategory.subcategory_id,
    //                     subcategory_name: subcategory.subcategory_name,
    //                     subcategory_slug: subcategory.subcategory_slug,
    //                     subcategory_rank: subcategory.subcategory_rank,
    //                     subcategory_type: subcategory.subcategory_type,

    //                     // Problem Data
    //                     problem_id: problem.problem_id,
    //                     problem_name: problem.problem_name,
    //                     problem_slug: problem.problem_slug,
    //                     problem_rank: problem.problem_rank,
    //                     problem_type: problem.problem_type,
    //                     hasIDE: problem.hasIDE,

    //                     // Handle misc properties (with fallbacks)
    //                     tags: this.getTags(misc),
    //                     facts: this.getFacts(misc),
    //                     hints: this.getHints(misc),
    //                     language: this.getLanguage(misc),
    //                     difficulty: this.getDifficulty(misc),
    //                     frequently_occuring_doubts: this.getDoubts(misc),
    //                     interview_followup_questions: this.getInterviewQuestions(misc)
    //                 };
    //             })
    //         )
    //     );
    // }

    // Helper Methods for misc Handling

    // static flatten(
    //     allSyllabus: AllSyllabus,
    //     selectedDifficultyChips: string[],
    //     selectedCategorychips: string[],
    //     selectedSubCatgoryChips: string[],
    //     selectedTagsChips: string[],
    //     sortBy: string,
    //     order: string
    // ): FlatProblem[] {
    //     // Helper to check if array filter is empty or includes the value
    //     const matchesFilter = (filterArray: string[], value: string | undefined): boolean => {
    //         if (!filterArray || filterArray.length === 0) return true;
    //         if (!value) return false;
    //         return filterArray.includes(value);
    //     };

    //     // Flatten and filter problems
    //     const flatProblems = allSyllabus.all_syllabus.all_syllabus.flatMap(category =>
    //         category.subcategories.flatMap(subcategory =>
    //             subcategory.problems
    //                 .map(problem => {
    //                     const misc = problem.misc;

    //                     return {
    //                         // Category Data
    //                         category_id: category.category_id,
    //                         category_name: category.category_name,
    //                         category_slug: category.category_slug,
    //                         category_rank: category.category_rank,

    //                         // Subcategory Data
    //                         subcategory_id: subcategory.subcategory_id,
    //                         subcategory_name: subcategory.subcategory_name,
    //                         subcategory_slug: subcategory.subcategory_slug,
    //                         subcategory_rank: subcategory.subcategory_rank,
    //                         subcategory_type: subcategory.subcategory_type,

    //                         // Problem Data
    //                         problem_id: problem.problem_id,
    //                         problem_name: problem.problem_name,
    //                         problem_slug: problem.problem_slug,
    //                         problem_rank: problem.problem_rank,
    //                         problem_type: problem.problem_type,
    //                         hasIDE: problem.hasIDE,

    //                         // Misc properties
    //                         tags: this.getTags(misc) || [],
    //                         facts: this.getFacts(misc),
    //                         hints: this.getHints(misc),
    //                         language: this.getLanguage(misc),
    //                         difficulty: this.getDifficulty(misc),
    //                         frequently_occuring_doubts: this.getDoubts(misc),
    //                         interview_followup_questions: this.getInterviewQuestions(misc)
    //                     };
    //                 })
    //                 .filter(problem => {
    //                     // Filter by difficulty chips
    //                     if (selectedDifficultyChips.length > 0 && !selectedDifficultyChips.includes(problem.difficulty)) {
    //                         return false;
    //                     }

    //                     // Filter by category chips (assuming category_id or category_name)
    //                     if (selectedCategorychips.length > 0 && !selectedCategorychips.includes(problem.category_id) && !selectedCategorychips.includes(problem.category_name)) {
    //                         return false;
    //                     }

    //                     // Filter by subcategory chips (subcategory_id or subcategory_name)
    //                     if (selectedSubCatgoryChips.length > 0 && !selectedSubCatgoryChips.includes(problem.subcategory_id) && !selectedSubCatgoryChips.includes(problem.subcategory_name)) {
    //                         return false;
    //                     }

    //                     // Filter by tags — check if problem.tags contains all selected tags
    //                     if (selectedTagsChips.length > 0) {
    //                         if (!problem.tags || !selectedTagsChips.every(tag => problem.tags.includes(tag))) {
    //                             return false;
    //                         }
    //                     }

    //                     return true;
    //                 })
    //         )
    //     );

    //     // // Sorting helper
    //     // const sortedProblems = flatProblems.sort((a, b) => {
    //     //     const aVal = a[sortBy];
    //     //     const bVal = b[sortBy];

    //     //     if (aVal === undefined || bVal === undefined) return 0;

    //     //     // Handle string comparison
    //     //     if (typeof aVal === 'string' && typeof bVal === 'string') {
    //     //         if (order === 'asc') return aVal.localeCompare(bVal);
    //     //         else return bVal.localeCompare(aVal);
    //     //     }

    //     //     // Handle number comparison
    //     //     if (typeof aVal === 'number' && typeof bVal === 'number') {
    //     //         if (order === 'asc') return aVal - bVal;
    //     //         else return bVal - aVal;
    //     //     }

    //     //     return 0;
    //     // });

    //     return flatProblems;
    // }

    private static getTags(misc?: Misc | string | null): string[] {
        if (!misc || typeof misc === 'string') return [];
        return misc.tags || [];
    }

    private static getFacts(misc?: Misc | string | null): string {
        if (!misc || typeof misc === 'string') return '';
        return misc.facts || '';
    }

    private static getHints(misc?: Misc | string | null): string[] {
        if (!misc || typeof misc === 'string') return [];
        return misc.hints?.map(h => h.hint) || [];
    }

    private static getLanguage(misc?: Misc | string | null): string[] {
        if (!misc || typeof misc === 'string') return [];
        return misc.language || [];
    }

    private static getDifficulty(misc?: Misc | string | null): string {
        if (!misc || typeof misc === 'string') return 'Unknown';
        return misc.difficulty || 'Unknown';
    }

    private static getDoubts(misc?: Misc | string | null): Doubt[] {
        if (!misc || typeof misc === 'string') return [];
        return misc.frequently_occuring_doubts || [];
    }

    private static getInterviewQuestions(misc?: Misc | string | null): InterviewFollowup[] {
        if (!misc || typeof misc === 'string') return [];
        return misc.interview_followup_questions || [];
    }
}

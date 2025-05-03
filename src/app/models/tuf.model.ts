// models/tuf.model.ts
// models/problem.model.ts

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

export interface Misc {
    tags: string[];
    facts: string;
    hints: Hint[];
    language: string[];
    difficulty: string;
    frequently_occuring_doubts: Doubt[];
    interview_followup_questions: InterviewFollowup[];
}

export interface Problem {
    problem_id: string;
    problem_name: string;
    problem_slug: string;
    problem_rank: number;
    misc: Misc;
    problem_type: string;
    hasIDE: boolean;
}


export interface Subcategory {
    subcategory_id: string;
    subcategory_name: string;
    subcategory_slug: string;
    subcategory_rank: number;
    subcategory_type: string;
    problems: Problem[];
}

export interface Category {
    category_id: string;
    category_name: string;
    category_slug: string;
    category_rank: number;
    subcategories: Subcategory[];
}

export interface TufData {
    all_syllabus: {
        all_syllabus: [];
        isCoreSubject: number;
    };
}

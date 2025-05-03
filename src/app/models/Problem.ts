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

export interface Problem {
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
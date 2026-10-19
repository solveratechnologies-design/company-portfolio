export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/**
 * Add only genuine, client-approved testimonials here.
 * While this list is empty, the homepage shows "What You Can Expect" instead.
 */
export const testimonials: Testimonial[] = [];

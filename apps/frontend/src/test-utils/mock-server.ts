import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

// Generate mock data
const generateUser = (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(['user', 'admin', 'moderator']),
    profilePicture: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
});

const generatePost = (overrides = {}) => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    excerpt: faker.lorem.sentence(),
    author: generateUser(),
    status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
    tags: faker.helpers.arrayElements(['tech', 'programming', 'web', 'react'], 3),
    categories: faker.helpers.arrayElements(['tutorial', 'guide', 'news'], 2),
    viewCount: faker.number.int({ min: 0, max: 1000 }),
    likeCount: faker.number.int({ min: 0, max: 500 }),
    featuredImage: faker.image.url(),
    publishedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    readingTime: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
});

// Mock API handlers
export const handlers = [
    // Auth endpoints
    http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
        const body = await request.json() as { email: string; password: string };

        if (body.email === 'test@example.com' && body.password === 'Password123!') {
            return HttpResponse.json({
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                user: generateUser({ email: body.email }),
            });
        }

        return new HttpResponse(null, { status: 401 });
    }),

    http.post('http://localhost:3001/api/auth/register', async () => {
        return HttpResponse.json({
            message: 'Registration successful',
            user: generateUser(),
        });
    }),

    http.get('http://localhost:3001/api/auth/me', ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (authHeader?.startsWith('Bearer ')) {
            return HttpResponse.json(generateUser());
        }

        return new HttpResponse(null, { status: 401 });
    }),

    // Posts endpoints
    http.get('http://localhost:3001/api/posts', ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        const posts = Array.from({ length: limit }, (_, i) =>
            generatePost({ id: `post-${(page - 1) * limit + i + 1}` })
        );

        return HttpResponse.json({
            posts,
            meta: {
                page,
                limit,
                total: 100,
                totalPages: 10,
            },
        });
    }),

    http.get('http://localhost:3001/api/posts/:id', ({ params }) => {
        const { id } = params;
        return HttpResponse.json(generatePost({ id }));
    }),

    http.post('http://localhost:3001/api/posts', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(generatePost(body));
    }),

    http.put('http://localhost:3001/api/posts/:id', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(generatePost(body));
    }),

    http.delete('http://localhost:3001/api/posts/:id', () => {
        return HttpResponse.json({ message: 'Post deleted successfully' });
    }),

    // Users endpoints
    http.get('http://localhost:3001/api/users', () => {
        const users = Array.from({ length: 10 }, () => generateUser());
        return HttpResponse.json(users);
    }),

    http.get('http://localhost:3001/api/users/:id', ({ params }) => {
        const { id } = params;
        return HttpResponse.json(generateUser({ id }));
    }),
];

export const server = setupServer(...handlers);
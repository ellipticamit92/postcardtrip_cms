import { prisma } from "@/lib/prisma";

export async function getPaginatedQueries(page: number = 1) {
  const pageSize = 3;
  const skip = (page - 1) * pageSize;

  const [queries, total] = await Promise.all([
    prisma.queries.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.queries.count(),
  ]);

  return {
    queries,
    totalPages: Math.ceil(total / pageSize),
    totalCount: total,
    currentPage: page,
  };
}

export async function getQueryById(id: number | string) {
  try {
    const query = await prisma.queries.findUnique({
      where: {
        qid: typeof id === "string" ? parseInt(id) : id,
      },
    });

    return query;
  } catch (error) {
    console.error("Error fetching query by ID:", error);
    throw new Error("Could not fetch query by ID");
  }
}

/**
 * Assign a query to a new user.
 * @param qid The query ID
 * @param userId The user ID to assign
 * @returns The updated query
 */
export async function updateAssignedUserToQuery(qid: number, userId: number) {
  try {
    // Fetch the user to get their name
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update the Queries record
    const updatedQuery = await prisma.queries.update({
      where: { qid },
      data: {
        assignedToId: userId,
        assignedToName: user.name || null,
      },
    });

    return updatedQuery;
  } catch (error) {
    console.error("Error assigning user to query:", error);
    throw new Error("Failed to assign user to query");
  }
}

export async function getQueryNotes(queryId: number | string) {
  try {
    const notes = await prisma.queryNotes.findMany({
      where: {
        queryId: typeof queryId === "string" ? parseInt(queryId) : queryId,
      },
      include: {
        addedBy: true, // Include user details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notes;
  } catch (error) {
    console.error("Error fetching query notes:", error);
    throw new Error("Could not fetch query notes");
  }
}

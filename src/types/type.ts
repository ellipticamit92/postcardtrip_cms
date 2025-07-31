export type User = {
  id: number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role?: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type Account = {
  id: number;
  userId: number;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
};

export type Session = {
  id: number;
  sessionToken: string;
  userId: number;
  expires: Date;
};

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Date;
};

export type Queries = {
  qid: number;
  leadId: string;
  platform: string;
  clientDescription: string;
  company?: string | null;
  destination?: string | null;
  title?: string | null;
  description: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  flightRequired: string;
  children?: number | null;
  adult?: number | null;
  infant?: number | null;
  isOrganic?: string | null;
  travelStartDate: Date;
  travelEndDate: Date;
  travelMonth?: string | null;
  leadCreatedTime: string;
  formName: string;
  campaignName: string;
  adsetName: string;
  adName: string;
  leadStatus: string;
  assignedToId?: number | null;
  addedById?: number | null;
  assignedToName?: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type QueryTask = {
  qtid: number;
  queryId: number;
  assignToId?: number | null;
  addedById: number;
  details: string;
  status?: number | null;
  reminderDate?: Date | null;
  confirmDate?: Date | null;
  taskType: string;
  updatedAt: Date;
  createdAt: Date;
  time: string;
  addedBy: User;
};

export type QueryNotes = {
  qnId: number;
  queryId: number;
  details: string;
  addedById: number;
  createdAt: Date;
  addedBy: User;
};

export type QueryData = {
  queries: Queries[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
};

export type Team = {
  tid: number;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  username?: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type QueryNotesResponse = QueryNotes[];
export type QueryTaskResponse = QueryTask[];
export type QueriesResponse = Queries[];
export type UsersResponse = User[];

/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A high precision floating point value represented as a string */
  BigFloat: { input: string; output: string };
  /** An arbitrary size integer represented as a string */
  BigInt: { input: string; output: string };
  /** An opaque string using for tracking a position in results during pagination */
  Cursor: { input: any; output: any };
  /** A date wihout time information */
  Date: { input: string; output: string };
  /** A date and time */
  Datetime: { input: string; output: string };
  /** A Javascript Object Notation value serialized as a string */
  JSON: { input: string; output: string };
  /** Any type not handled by the type system */
  Opaque: { input: any; output: any };
  /** A time without date information */
  Time: { input: string; output: string };
  /** A universally unique identifier */
  UUID: { input: string; output: string };
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars["BigFloat"]["input"]>;
  gt?: InputMaybe<Scalars["BigFloat"]["input"]>;
  gte?: InputMaybe<Scalars["BigFloat"]["input"]>;
  in?: InputMaybe<Array<Scalars["BigFloat"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["BigFloat"]["input"]>;
  lte?: InputMaybe<Scalars["BigFloat"]["input"]>;
  neq?: InputMaybe<Scalars["BigFloat"]["input"]>;
};

/** Boolean expression comparing fields on type "BigFloatList" */
export type BigFloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars["BigFloat"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["BigFloat"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["BigFloat"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["BigFloat"]["input"]>>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  neq?: InputMaybe<Scalars["BigInt"]["input"]>;
};

/** Boolean expression comparing fields on type "BigIntList" */
export type BigIntListFilter = {
  containedBy?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "BooleanList" */
export type BooleanListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars["Date"]["input"]>;
  gt?: InputMaybe<Scalars["Date"]["input"]>;
  gte?: InputMaybe<Scalars["Date"]["input"]>;
  in?: InputMaybe<Array<Scalars["Date"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["Date"]["input"]>;
  lte?: InputMaybe<Scalars["Date"]["input"]>;
  neq?: InputMaybe<Scalars["Date"]["input"]>;
};

/** Boolean expression comparing fields on type "DateList" */
export type DateListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Date"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Date"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Date"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Date"]["input"]>>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars["Datetime"]["input"]>;
  gt?: InputMaybe<Scalars["Datetime"]["input"]>;
  gte?: InputMaybe<Scalars["Datetime"]["input"]>;
  in?: InputMaybe<Array<Scalars["Datetime"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["Datetime"]["input"]>;
  lte?: InputMaybe<Scalars["Datetime"]["input"]>;
  neq?: InputMaybe<Scalars["Datetime"]["input"]>;
};

/** Boolean expression comparing fields on type "DatetimeList" */
export type DatetimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Datetime"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Datetime"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Datetime"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Datetime"]["input"]>>;
};

export enum FilterIs {
  NotNull = "NOT_NULL",
  Null = "NULL",
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
  neq?: InputMaybe<Scalars["Float"]["input"]>;
};

/** Boolean expression comparing fields on type "FloatList" */
export type FloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars["ID"]["input"]>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  neq?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Boolean expression comparing fields on type "IntList" */
export type IntListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: "Mutation";
  /** Deletes zero or more records from the `ai_training_data` collection */
  deleteFromai_training_dataCollection: Ai_Training_DataDeleteResponse;
  /** Deletes zero or more records from the `coaches` collection */
  deleteFromcoachesCollection: CoachesDeleteResponse;
  /** Deletes zero or more records from the `metric_results` collection */
  deleteFrommetric_resultsCollection: Metric_ResultsDeleteResponse;
  /** Deletes zero or more records from the `metrics` collection */
  deleteFrommetricsCollection: MetricsDeleteResponse;
  /** Deletes zero or more records from the `profiles` collection */
  deleteFromprofilesCollection: ProfilesDeleteResponse;
  /** Deletes zero or more records from the `swim_groups` collection */
  deleteFromswim_groupsCollection: Swim_GroupsDeleteResponse;
  /** Deletes zero or more records from the `swimmers` collection */
  deleteFromswimmersCollection: SwimmersDeleteResponse;
  /** Deletes zero or more records from the `teams` collection */
  deleteFromteamsCollection: TeamsDeleteResponse;
  /** Deletes zero or more records from the `workouts` collection */
  deleteFromworkoutsCollection: WorkoutsDeleteResponse;
  /** Adds one or more `ai_training_data` records to the collection */
  insertIntoai_training_dataCollection?: Maybe<Ai_Training_DataInsertResponse>;
  /** Adds one or more `coaches` records to the collection */
  insertIntocoachesCollection?: Maybe<CoachesInsertResponse>;
  /** Adds one or more `metric_results` records to the collection */
  insertIntometric_resultsCollection?: Maybe<Metric_ResultsInsertResponse>;
  /** Adds one or more `metrics` records to the collection */
  insertIntometricsCollection?: Maybe<MetricsInsertResponse>;
  /** Adds one or more `profiles` records to the collection */
  insertIntoprofilesCollection?: Maybe<ProfilesInsertResponse>;
  /** Adds one or more `swim_groups` records to the collection */
  insertIntoswim_groupsCollection?: Maybe<Swim_GroupsInsertResponse>;
  /** Adds one or more `swimmers` records to the collection */
  insertIntoswimmersCollection?: Maybe<SwimmersInsertResponse>;
  /** Adds one or more `teams` records to the collection */
  insertIntoteamsCollection?: Maybe<TeamsInsertResponse>;
  /** Adds one or more `workouts` records to the collection */
  insertIntoworkoutsCollection?: Maybe<WorkoutsInsertResponse>;
  /** Updates zero or more records in the `ai_training_data` collection */
  updateai_training_dataCollection: Ai_Training_DataUpdateResponse;
  /** Updates zero or more records in the `coaches` collection */
  updatecoachesCollection: CoachesUpdateResponse;
  /** Updates zero or more records in the `metric_results` collection */
  updatemetric_resultsCollection: Metric_ResultsUpdateResponse;
  /** Updates zero or more records in the `metrics` collection */
  updatemetricsCollection: MetricsUpdateResponse;
  /** Updates zero or more records in the `profiles` collection */
  updateprofilesCollection: ProfilesUpdateResponse;
  /** Updates zero or more records in the `swim_groups` collection */
  updateswim_groupsCollection: Swim_GroupsUpdateResponse;
  /** Updates zero or more records in the `swimmers` collection */
  updateswimmersCollection: SwimmersUpdateResponse;
  /** Updates zero or more records in the `teams` collection */
  updateteamsCollection: TeamsUpdateResponse;
  /** Updates zero or more records in the `workouts` collection */
  updateworkoutsCollection: WorkoutsUpdateResponse;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromai_Training_DataCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Ai_Training_DataFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromcoachesCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<CoachesFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFrommetric_ResultsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Metric_ResultsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFrommetricsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<MetricsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromprofilesCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<ProfilesFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromswim_GroupsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Swim_GroupsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromswimmersCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<SwimmersFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromteamsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<TeamsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromworkoutsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<WorkoutsFilter>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoai_Training_DataCollectionArgs = {
  objects: Array<Ai_Training_DataInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntocoachesCollectionArgs = {
  objects: Array<CoachesInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntometric_ResultsCollectionArgs = {
  objects: Array<Metric_ResultsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntometricsCollectionArgs = {
  objects: Array<MetricsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoprofilesCollectionArgs = {
  objects: Array<ProfilesInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoswim_GroupsCollectionArgs = {
  objects: Array<Swim_GroupsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoswimmersCollectionArgs = {
  objects: Array<SwimmersInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoteamsCollectionArgs = {
  objects: Array<TeamsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoworkoutsCollectionArgs = {
  objects: Array<WorkoutsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationUpdateai_Training_DataCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Ai_Training_DataFilter>;
  set: Ai_Training_DataUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatecoachesCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<CoachesFilter>;
  set: CoachesUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatemetric_ResultsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Metric_ResultsFilter>;
  set: Metric_ResultsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatemetricsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<MetricsFilter>;
  set: MetricsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateprofilesCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<ProfilesFilter>;
  set: ProfilesUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateswim_GroupsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<Swim_GroupsFilter>;
  set: Swim_GroupsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateswimmersCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<SwimmersFilter>;
  set: SwimmersUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateteamsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<TeamsFilter>;
  set: TeamsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateworkoutsCollectionArgs = {
  atMost?: Scalars["Int"]["input"];
  filter?: InputMaybe<WorkoutsFilter>;
  set: WorkoutsUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars["ID"]["output"];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars["Opaque"]["input"]>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  AscNullsFirst = "AscNullsFirst",
  /** Ascending order, nulls last */
  AscNullsLast = "AscNullsLast",
  /** Descending order, nulls first */
  DescNullsFirst = "DescNullsFirst",
  /** Descending order, nulls last */
  DescNullsLast = "DescNullsLast",
}

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

/** The root type for querying data */
export type Query = {
  __typename?: "Query";
  /** A pagable collection of type `ai_training_data` */
  ai_training_dataCollection?: Maybe<Ai_Training_DataConnection>;
  /** A pagable collection of type `coaches` */
  coachesCollection?: Maybe<CoachesConnection>;
  /** A pagable collection of type `metric_results` */
  metric_resultsCollection?: Maybe<Metric_ResultsConnection>;
  /** A pagable collection of type `metrics` */
  metricsCollection?: Maybe<MetricsConnection>;
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `profiles` */
  profilesCollection?: Maybe<ProfilesConnection>;
  /** A pagable collection of type `swim_groups` */
  swim_groupsCollection?: Maybe<Swim_GroupsConnection>;
  /** A pagable collection of type `swimmers` */
  swimmersCollection?: Maybe<SwimmersConnection>;
  /** A pagable collection of type `teams` */
  teamsCollection?: Maybe<TeamsConnection>;
  /** A pagable collection of type `workouts` */
  workoutsCollection?: Maybe<WorkoutsConnection>;
};

/** The root type for querying data */
export type QueryAi_Training_DataCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Ai_Training_DataFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Ai_Training_DataOrderBy>>;
};

/** The root type for querying data */
export type QueryCoachesCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<CoachesFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<CoachesOrderBy>>;
};

/** The root type for querying data */
export type QueryMetric_ResultsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Metric_ResultsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Metric_ResultsOrderBy>>;
};

/** The root type for querying data */
export type QueryMetricsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<MetricsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<MetricsOrderBy>>;
};

/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"]["input"];
};

/** The root type for querying data */
export type QueryProfilesCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<ProfilesFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>;
};

/** The root type for querying data */
export type QuerySwim_GroupsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Swim_GroupsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Swim_GroupsOrderBy>>;
};

/** The root type for querying data */
export type QuerySwimmersCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<SwimmersFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<SwimmersOrderBy>>;
};

/** The root type for querying data */
export type QueryTeamsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<TeamsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TeamsOrderBy>>;
};

/** The root type for querying data */
export type QueryWorkoutsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<WorkoutsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkoutsOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  ilike?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  iregex?: InputMaybe<Scalars["String"]["input"]>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars["String"]["input"]>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  neq?: InputMaybe<Scalars["String"]["input"]>;
  regex?: InputMaybe<Scalars["String"]["input"]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression comparing fields on type "StringList" */
export type StringListFilter = {
  containedBy?: InputMaybe<Array<Scalars["String"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["String"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars["Time"]["input"]>;
  gt?: InputMaybe<Scalars["Time"]["input"]>;
  gte?: InputMaybe<Scalars["Time"]["input"]>;
  in?: InputMaybe<Array<Scalars["Time"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars["Time"]["input"]>;
  lte?: InputMaybe<Scalars["Time"]["input"]>;
  neq?: InputMaybe<Scalars["Time"]["input"]>;
};

/** Boolean expression comparing fields on type "TimeList" */
export type TimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars["Time"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["Time"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["Time"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["Time"]["input"]>>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars["UUID"]["input"]>;
  in?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars["UUID"]["input"]>;
};

/** Boolean expression comparing fields on type "UUIDList" */
export type UuidListFilter = {
  containedBy?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  contains?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  eq?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
};

export type Ai_Training_Data = Node & {
  __typename?: "ai_training_data";
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  group_id?: Maybe<Scalars["UUID"]["output"]>;
  id: Scalars["UUID"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  swim_groups?: Maybe<Swim_Groups>;
  training_data?: Maybe<Scalars["JSON"]["output"]>;
};

export type Ai_Training_DataConnection = {
  __typename?: "ai_training_dataConnection";
  edges: Array<Ai_Training_DataEdge>;
  pageInfo: PageInfo;
};

export type Ai_Training_DataDeleteResponse = {
  __typename?: "ai_training_dataDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Ai_Training_Data>;
};

export type Ai_Training_DataEdge = {
  __typename?: "ai_training_dataEdge";
  cursor: Scalars["String"]["output"];
  node: Ai_Training_Data;
};

export type Ai_Training_DataFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Ai_Training_DataFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  group_id?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Ai_Training_DataFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Ai_Training_DataFilter>>;
};

export type Ai_Training_DataInsertInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  training_data?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type Ai_Training_DataInsertResponse = {
  __typename?: "ai_training_dataInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Ai_Training_Data>;
};

export type Ai_Training_DataOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  group_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
};

export type Ai_Training_DataUpdateInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  training_data?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type Ai_Training_DataUpdateResponse = {
  __typename?: "ai_training_dataUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Ai_Training_Data>;
};

export type Coaches = Node & {
  __typename?: "coaches";
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["UUID"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  swim_groupsCollection?: Maybe<Swim_GroupsConnection>;
  team_id?: Maybe<Scalars["UUID"]["output"]>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
  workoutsCollection?: Maybe<WorkoutsConnection>;
};

export type CoachesSwim_GroupsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Swim_GroupsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Swim_GroupsOrderBy>>;
};

export type CoachesWorkoutsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<WorkoutsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkoutsOrderBy>>;
};

export type CoachesConnection = {
  __typename?: "coachesConnection";
  edges: Array<CoachesEdge>;
  pageInfo: PageInfo;
};

export type CoachesDeleteResponse = {
  __typename?: "coachesDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Coaches>;
};

export type CoachesEdge = {
  __typename?: "coachesEdge";
  cursor: Scalars["String"]["output"];
  node: Coaches;
};

export type CoachesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CoachesFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CoachesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CoachesFilter>>;
  team_id?: InputMaybe<UuidFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type CoachesInsertInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  team_id?: InputMaybe<Scalars["UUID"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type CoachesInsertResponse = {
  __typename?: "coachesInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Coaches>;
};

export type CoachesOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  team_id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type CoachesUpdateInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  team_id?: InputMaybe<Scalars["UUID"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type CoachesUpdateResponse = {
  __typename?: "coachesUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Coaches>;
};

export type Metric_Results = Node & {
  __typename?: "metric_results";
  computed_score?: Maybe<Scalars["BigFloat"]["output"]>;
  id: Scalars["UUID"]["output"];
  metric_id?: Maybe<Scalars["UUID"]["output"]>;
  metrics?: Maybe<Metrics>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  recorded_at?: Maybe<Scalars["Datetime"]["output"]>;
  swimmer_id?: Maybe<Scalars["UUID"]["output"]>;
};

export type Metric_ResultsConnection = {
  __typename?: "metric_resultsConnection";
  edges: Array<Metric_ResultsEdge>;
  pageInfo: PageInfo;
};

export type Metric_ResultsDeleteResponse = {
  __typename?: "metric_resultsDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metric_Results>;
};

export type Metric_ResultsEdge = {
  __typename?: "metric_resultsEdge";
  cursor: Scalars["String"]["output"];
  node: Metric_Results;
};

export type Metric_ResultsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Metric_ResultsFilter>>;
  computed_score?: InputMaybe<BigFloatFilter>;
  id?: InputMaybe<UuidFilter>;
  metric_id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Metric_ResultsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Metric_ResultsFilter>>;
  recorded_at?: InputMaybe<DatetimeFilter>;
  swimmer_id?: InputMaybe<UuidFilter>;
};

export type Metric_ResultsInsertInput = {
  computed_score?: InputMaybe<Scalars["BigFloat"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  metric_id?: InputMaybe<Scalars["UUID"]["input"]>;
  recorded_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  swimmer_id?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type Metric_ResultsInsertResponse = {
  __typename?: "metric_resultsInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metric_Results>;
};

export type Metric_ResultsOrderBy = {
  computed_score?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  metric_id?: InputMaybe<OrderByDirection>;
  recorded_at?: InputMaybe<OrderByDirection>;
  swimmer_id?: InputMaybe<OrderByDirection>;
};

export type Metric_ResultsUpdateInput = {
  computed_score?: InputMaybe<Scalars["BigFloat"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  metric_id?: InputMaybe<Scalars["UUID"]["input"]>;
  recorded_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  swimmer_id?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type Metric_ResultsUpdateResponse = {
  __typename?: "metric_resultsUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metric_Results>;
};

export type Metrics = Node & {
  __typename?: "metrics";
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  group_id?: Maybe<Scalars["UUID"]["output"]>;
  id: Scalars["UUID"]["output"];
  metric_resultsCollection?: Maybe<Metric_ResultsConnection>;
  name: Scalars["String"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  swim_groups?: Maybe<Swim_Groups>;
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
};

export type MetricsMetric_ResultsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Metric_ResultsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Metric_ResultsOrderBy>>;
};

export type MetricsConnection = {
  __typename?: "metricsConnection";
  edges: Array<MetricsEdge>;
  pageInfo: PageInfo;
};

export type MetricsDeleteResponse = {
  __typename?: "metricsDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metrics>;
};

export type MetricsEdge = {
  __typename?: "metricsEdge";
  cursor: Scalars["String"]["output"];
  node: Metrics;
};

export type MetricsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<MetricsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  group_id?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<MetricsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<MetricsFilter>>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type MetricsInsertInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type MetricsInsertResponse = {
  __typename?: "metricsInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metrics>;
};

export type MetricsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  group_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  type?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type MetricsUpdateInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type MetricsUpdateResponse = {
  __typename?: "metricsUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Metrics>;
};

export type Profiles = Node & {
  __typename?: "profiles";
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  first_name?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  last_name?: Maybe<Scalars["String"]["output"]>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  role?: Maybe<Scalars["String"]["output"]>;
  swimmers: Swimmers;
  teamsCollection?: Maybe<TeamsConnection>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ProfilesTeamsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<TeamsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TeamsOrderBy>>;
};

export type ProfilesConnection = {
  __typename?: "profilesConnection";
  edges: Array<ProfilesEdge>;
  pageInfo: PageInfo;
};

export type ProfilesDeleteResponse = {
  __typename?: "profilesDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Profiles>;
};

export type ProfilesEdge = {
  __typename?: "profilesEdge";
  cursor: Scalars["String"]["output"];
  node: Profiles;
};

export type ProfilesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ProfilesFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  email?: InputMaybe<StringFilter>;
  first_name?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  last_name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ProfilesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ProfilesFilter>>;
  role?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type ProfilesInsertInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  first_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  last_name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type ProfilesInsertResponse = {
  __typename?: "profilesInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Profiles>;
};

export type ProfilesOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  email?: InputMaybe<OrderByDirection>;
  first_name?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  last_name?: InputMaybe<OrderByDirection>;
  role?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type ProfilesUpdateInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  first_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  last_name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type ProfilesUpdateResponse = {
  __typename?: "profilesUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Profiles>;
};

export enum Role {
  Admin = "admin",
  Coach = "coach",
  Swimmer = "swimmer",
}

/** Boolean expression comparing fields on type "role" */
export type RoleFilter = {
  eq?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Role>;
};

export type Swim_Groups = Node & {
  __typename?: "swim_groups";
  ai_training_dataCollection?: Maybe<Ai_Training_DataConnection>;
  coach_id?: Maybe<Scalars["UUID"]["output"]>;
  coaches?: Maybe<Coaches>;
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  metricsCollection?: Maybe<MetricsConnection>;
  name: Scalars["String"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  swimmersCollection?: Maybe<SwimmersConnection>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
  workoutsCollection?: Maybe<WorkoutsConnection>;
};

export type Swim_GroupsAi_Training_DataCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<Ai_Training_DataFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<Ai_Training_DataOrderBy>>;
};

export type Swim_GroupsMetricsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<MetricsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<MetricsOrderBy>>;
};

export type Swim_GroupsSwimmersCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<SwimmersFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<SwimmersOrderBy>>;
};

export type Swim_GroupsWorkoutsCollectionArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  filter?: InputMaybe<WorkoutsFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<WorkoutsOrderBy>>;
};

export type Swim_GroupsConnection = {
  __typename?: "swim_groupsConnection";
  edges: Array<Swim_GroupsEdge>;
  pageInfo: PageInfo;
};

export type Swim_GroupsDeleteResponse = {
  __typename?: "swim_groupsDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swim_Groups>;
};

export type Swim_GroupsEdge = {
  __typename?: "swim_groupsEdge";
  cursor: Scalars["String"]["output"];
  node: Swim_Groups;
};

export type Swim_GroupsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Swim_GroupsFilter>>;
  coach_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Swim_GroupsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Swim_GroupsFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type Swim_GroupsInsertInput = {
  coach_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type Swim_GroupsInsertResponse = {
  __typename?: "swim_groupsInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swim_Groups>;
};

export type Swim_GroupsOrderBy = {
  coach_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type Swim_GroupsUpdateInput = {
  coach_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type Swim_GroupsUpdateResponse = {
  __typename?: "swim_groupsUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swim_Groups>;
};

export type Swimmers = Node & {
  __typename?: "swimmers";
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  date_of_birth?: Maybe<Scalars["Date"]["output"]>;
  group_id?: Maybe<Scalars["UUID"]["output"]>;
  id: Scalars["UUID"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  profiles: Profiles;
  swim_groups?: Maybe<Swim_Groups>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
};

export type SwimmersConnection = {
  __typename?: "swimmersConnection";
  edges: Array<SwimmersEdge>;
  pageInfo: PageInfo;
};

export type SwimmersDeleteResponse = {
  __typename?: "swimmersDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swimmers>;
};

export type SwimmersEdge = {
  __typename?: "swimmersEdge";
  cursor: Scalars["String"]["output"];
  node: Swimmers;
};

export type SwimmersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<SwimmersFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  date_of_birth?: InputMaybe<DateFilter>;
  group_id?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<SwimmersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<SwimmersFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type SwimmersInsertInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["Date"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type SwimmersInsertResponse = {
  __typename?: "swimmersInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swimmers>;
};

export type SwimmersOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  date_of_birth?: InputMaybe<OrderByDirection>;
  group_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type SwimmersUpdateInput = {
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["Date"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type SwimmersUpdateResponse = {
  __typename?: "swimmersUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Swimmers>;
};

export type Teams = Node & {
  __typename?: "teams";
  admin_id?: Maybe<Scalars["UUID"]["output"]>;
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["UUID"]["output"];
  location?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  profiles?: Maybe<Profiles>;
  updated_at?: Maybe<Scalars["Datetime"]["output"]>;
};

export type TeamsConnection = {
  __typename?: "teamsConnection";
  edges: Array<TeamsEdge>;
  pageInfo: PageInfo;
};

export type TeamsDeleteResponse = {
  __typename?: "teamsDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Teams>;
};

export type TeamsEdge = {
  __typename?: "teamsEdge";
  cursor: Scalars["String"]["output"];
  node: Teams;
};

export type TeamsFilter = {
  admin_id?: InputMaybe<UuidFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<TeamsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  location?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<TeamsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<TeamsFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type TeamsInsertInput = {
  admin_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  location?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type TeamsInsertResponse = {
  __typename?: "teamsInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Teams>;
};

export type TeamsOrderBy = {
  admin_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  location?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type TeamsUpdateInput = {
  admin_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  location?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type TeamsUpdateResponse = {
  __typename?: "teamsUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Teams>;
};

export type Workouts = Node & {
  __typename?: "workouts";
  coach_id?: Maybe<Scalars["UUID"]["output"]>;
  coaches?: Maybe<Coaches>;
  created_at?: Maybe<Scalars["Datetime"]["output"]>;
  group_id?: Maybe<Scalars["UUID"]["output"]>;
  id: Scalars["UUID"]["output"];
  /** Globally Unique Record Identifier */
  nodeId: Scalars["ID"]["output"];
  swim_groups?: Maybe<Swim_Groups>;
  workout_data?: Maybe<Scalars["JSON"]["output"]>;
};

export type WorkoutsConnection = {
  __typename?: "workoutsConnection";
  edges: Array<WorkoutsEdge>;
  pageInfo: PageInfo;
};

export type WorkoutsDeleteResponse = {
  __typename?: "workoutsDeleteResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Workouts>;
};

export type WorkoutsEdge = {
  __typename?: "workoutsEdge";
  cursor: Scalars["String"]["output"];
  node: Workouts;
};

export type WorkoutsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<WorkoutsFilter>>;
  coach_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  group_id?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<WorkoutsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<WorkoutsFilter>>;
};

export type WorkoutsInsertInput = {
  coach_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  workout_data?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type WorkoutsInsertResponse = {
  __typename?: "workoutsInsertResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Workouts>;
};

export type WorkoutsOrderBy = {
  coach_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  group_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
};

export type WorkoutsUpdateInput = {
  coach_id?: InputMaybe<Scalars["UUID"]["input"]>;
  created_at?: InputMaybe<Scalars["Datetime"]["input"]>;
  group_id?: InputMaybe<Scalars["UUID"]["input"]>;
  id?: InputMaybe<Scalars["UUID"]["input"]>;
  workout_data?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type WorkoutsUpdateResponse = {
  __typename?: "workoutsUpdateResponse";
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars["Int"]["output"];
  /** Array of records impacted by the mutation */
  records: Array<Workouts>;
};

export interface Webhook {
  object: string
  entry: Entry[]
}

export interface Entry {
  id: string
  changes: Change[]
}

export interface Change {
  value: Value
  field: string
}

export interface Value {
  messaging_product: string
  metadata: Metadata
  contacts?: Contact[]
  messages?: Message[]
  statuses?: Status[]
}

export interface Contact {
  profile: Profile
  wa_id: string
}

export interface Profile {
  name: string
}

export interface Message {
  from: string
  id: string
  timestamp: string
  text: Text
  type: string
}

export interface Text {
  body: string
}

export interface Metadata {
  display_phone_number: string
  phone_number_id: string
}

export interface Status {
  id: string
  status: string
  timestamp: string
  recipient_id: string
  errors?: Error[]
}

export interface Error {
  code: number
  title: string
}

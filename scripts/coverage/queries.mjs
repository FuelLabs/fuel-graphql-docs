export const GET_SCALARS = `
query IntrospectionQuery {
  __schema {
    types {
      kind
      name
    }
  }
}
`;

export const GET_ENUMS = `
query IntrospectionQuery {
  __schema {
    types {
      kind
      name
      enumValues {
        name
      }
    }
  }
}
`;

export const GET_UNIONS = `
query IntrospectionQuery {
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
`;

export const GET_INPUT_OBJECTS = `
query IntrospectionQuery {
  __schema {
    types {
      kind
      name
      inputFields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
`;

export const GET_OBJECTS = `
query IntrospectionQuery {
  __schema {
    types {
      kind
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
`;

export const GET_QUERIES = `
query IntrospectionQuery {
  __schema {
    queryType {
      fields {
        name
        args {
          name
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const GET_MUTATIONS = `
query IntrospectionQuery {
  __schema {
    mutationType {
      fields {
        name
        args {
          name
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const GET_SUBSCRIPTIONS = `
  query IntrospectionQuery {
    __schema {
      subscriptionType {
        fields {
          name
          args {
            name
            type {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

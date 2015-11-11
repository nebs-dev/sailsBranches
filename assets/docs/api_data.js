define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthLogin"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "Register",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>Repeated password (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthRegister"
  },
  {
    "type": "get",
    "url": "/api/branch/:id",
    "title": "Branch data",
    "group": "Branch",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Branch",
    "name": "GetApiBranchId"
  },
  {
    "type": "get",
    "url": "/api/branches",
    "title": "list",
    "group": "Branch",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Branch",
    "name": "GetApiBranches"
  },
  {
    "type": "post",
    "url": "/api/branch/create",
    "title": "create",
    "group": "Branch",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Branch name (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "parent",
            "description": "<p>parent Branch ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Branch creator ID (superadmin)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Branch",
    "name": "PostApiBranchCreate"
  },
  {
    "type": "post",
    "url": "/api/branch/update/:id",
    "title": "update",
    "group": "Branch",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Branch name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>parent Branch ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "tree",
            "description": "<p>Tree ID (superadmin)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Branch",
    "name": "PostApiBranchUpdateId"
  },
  {
    "type": "get",
    "url": "/api/file/get/:id",
    "title": "get one",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "GetApiFileGetId"
  },
  {
    "type": "get",
    "url": "/api/file/getByBranch/:id",
    "title": "get all Files in Branch",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "GetApiFileGetbybranchId"
  },
  {
    "type": "post",
    "url": "/api/file/destroy/:id",
    "title": "destroy",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "PostApiFileDestroyId"
  },
  {
    "type": "post",
    "url": "/api/file/upload",
    "title": "upload",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "fileToUpload",
            "description": "<p>file to upload (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "tree",
            "description": "<p>Tree ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "branch",
            "description": "<p>Branch ID</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "PostApiFileUpload"
  },
  {
    "type": "post",
    "url": "/api/licence/create",
    "title": "create",
    "group": "Licence",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Licence name (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "vertical",
            "description": "<p>vertical levels (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "horizontal",
            "description": "<p>horizontal branches per level (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>float</p> ",
            "optional": false,
            "field": "price",
            "description": "<p>horizontal Licence price (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>boolean</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>Licence status - active/inactive (true/false)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Licence",
    "name": "PostApiLicenceCreate"
  },
  {
    "type": "post",
    "url": "/api/permission/add",
    "title": "add",
    "group": "Permission",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>User ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "branch",
            "description": "<p>Branch ID (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Permission",
    "name": "PostApiPermissionAdd"
  },
  {
    "type": "post",
    "url": "/api/permission/remove",
    "title": "remove",
    "group": "Permission",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>User ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "branch",
            "description": "<p>Branch ID (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Permission",
    "name": "PostApiPermissionRemove"
  },
  {
    "type": "get",
    "url": "/api/roles",
    "title": "list",
    "group": "Role",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Role",
    "name": "GetApiRoles"
  },
  {
    "type": "post",
    "url": "/api/role/create",
    "title": "create",
    "group": "Role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Role name (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Role",
    "name": "PostApiRoleCreate"
  },
  {
    "type": "post",
    "url": "/api/tree/create",
    "title": "create",
    "group": "Tree",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Tree name (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Tree",
    "name": "PostApiTreeCreate"
  },
  {
    "type": "get",
    "url": "/api/users",
    "title": "list",
    "group": "User",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "User",
    "name": "GetApiUsers"
  },
  {
    "type": "post",
    "url": "/api/user/addRole",
    "title": "add Role to User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>User ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "role_id",
            "description": "<p>Role ID (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "User",
    "name": "PostApiUserAddrole"
  },
  {
    "type": "post",
    "url": "/api/user/update/:id",
    "title": "update",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "User",
    "name": "PostApiUserUpdateId"
  },
  {
    "type": "get",
    "url": "/api/fileCategories",
    "title": "list",
    "group": "fileCategories",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "fileCategories",
    "name": "GetApiFilecategories"
  },
  {
    "type": "post",
    "url": "/api/fileCategories/create",
    "title": "create",
    "group": "fileCategories",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>fileCategories name (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "fileCategories",
    "name": "PostApiFilecategoriesCreate"
  },
  {
    "type": "post",
    "url": "/api/fileCategory/destroy/:id",
    "title": "destroy",
    "group": "fileCategories",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "fileCategories",
    "name": "PostApiFilecategoryDestroyId"
  }
] });
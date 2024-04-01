# Sapling's Guide

---

> [!NOTE]
> ## **Table of Contents**
> ---
> - ### [Introduction](#Introduction)
> - ### [Commands](#Commands)

---

## Introduction

Sapling, given its wide range of functions, these are separated into different modules, among them are:

> [!IMPORTANT]
> ### Modules
> > - sapling
> > - func
> > - fakeplayer
> > - camera
> > - config

Each module has a custom command that starts with `./` followed by the module name, for example: `./sapling`.

## Commands

The way to see all of Sapling's features is simple, just use the `./help` command in the chat and Sapling's ToDo List will be displayed

> [!NOTE]
> ### Commands List:
> > - ./help
> > - ./sapling
> > - ./func
> > - ./fakeplayer
> > - ./camera
> > - ./config
> > - ./hss
> > - ./calc
> > - ./prof

---

### sapling
> - Args: [ [`<feature>`](/docs/routes/sapling.md), `<boolean>` ] 
> - Example of use: `./sapling tntDuping true`

---

### func
> - Args: [ [`<feature>`](/docs/routes/func.md), `<boolean>` ] 
> - Example of use: `./func infoDisplay true`

---

### camera
> - Args: [ `<camera>` ]
> - Accepts: [ `free`, `reset`, `static` ]
> - Example of use: `./camera free`

---

### fakeplayer
> - Args: [ `<username>`, [`<action>`](/docs/routes/fakeplayer.md) ]
> - Example of use: `./fakeplayer CoolPlayer spawn`

---

### calc
> - Args: [ `<expression>` ]
> - Example of use: `./calc "2 + 2"`

---

### prof
> - Args: [ ]
> - Example of use: `./prof`

---

### hss
> - Args: [ `<action>`, `<args>` ]
> - Actions:
> > - `create "<x> <y> <z> <dimension> <hss type>"`
> > - `remove <hss uuid>`
> > - `list <hss type>`
> - Examples of use:
> > - `./hss create "0 0 0 overworld SwampHut"`
> > - `./hss remove 0fg1b77a9`
> > - `./hss list --all`

> [!IMPORTANT]
> ### HssTypes:
> > - SwampHut
> > - PillagerOutpost
> > - NetherFortress
> > - OceanMonument

---

### config
> - Args: [ `<action>`, `<string|boolean>` ]
> - Accepts:
> > - `lang <EN/ES/PT/JA/ZH>`
> > - `gameRulesFix <boolean>`
> > - `setAllValues <boolean>`

---

### help
> - Args: [ ]
> - Example of use: `./help`
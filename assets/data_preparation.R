library(dplyr)
library(stringr)




setwd('~/Dokumente/fremd/Wolfgang Lexer/mind-the-gap/assets/')


fns <- list.files('./Taggings_added/', full.names = TRUE)


data <- list(
  SP = list(fns[5], 5),
  FF = list(fns[2], 9),
  CP = list(fns[1], 5),
  NH = list(fns[3], 6),
  PF = list(fns[4], 9)
)

sector_lookup = c(SP = "spatial planning",
                  FF = "forest fires",
                  CP = "civil protection",
                  NH = "natural hazard management",
                  PF = "protection forests"
                  )


# read in and combine Excels:
d <- do.call(rbind, 
             names(data) |> 
               Map(f = \(nm) {d <- rio::import(data[[nm]][[1]], sheet = 1,
                                               skip = 1 + data[[nm]][[2]],
                                               header = FALSE
                                               )
               d <- d |>
                 mutate(id = sprintf("%s_%i", nm, row_number()), .before = 1) |> 
                 mutate(sector = sector_lookup[nm], .after = 1) 
               d
               })
) |> 
  setNames(nm = c(
    "id", "sector", "cluster", "measure", "validated", "phase", "gap", "risk", "ownership"
  )
  )


d_long <- d |> 
  mutate(validated = grepl('x', validated, ignore.case = TRUE) |> as.integer()) |> 
  tidyr::separate_rows(cluster, sep = "[\r\n]+") |> 
  tidyr::separate_rows(phase, sep = "[\r\n]+") |> 
  tidyr::separate_rows(gap, sep = "[\r\n]+") |> 
  tidyr::separate_rows(risk, sep = "[\r\n]+") |> 
  tidyr::separate_rows(risk, sep = ";") |>
  # filter cells without entry for cluster, stage or gap:
  filter(if_all(c(cluster, phase, gap), ~ .x != '')) |> 
  tidyr::separate(phase, into = c('phase', 'phase_category'), sep = ' *: *') |> 
  tidyr::replace_na(list(phase_category = '')) |> 
  mutate(across(where(is.character), ~ .x |> str_squish() |> tolower()))


head(d_long)

d_long |> distinct(phase, phase_category)


rio::export(d_long, '../src/data/data.csv')


head(d_long)

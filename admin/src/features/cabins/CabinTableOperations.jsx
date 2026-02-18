import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <SortBy
        options={[
          {
            value: "name-asc",
            label: "Sort by name (A-Z)",
          },
          {
            value: "name-dsc",
            label: "Sort by name (Z-A)",
          },
          { value: "regularPrice-asc", label: "Sort by price (Low to High)" },
          {
            value: "regularPrice-dsc",
            label: "Sort by price (High to Low)",
          },
          {
            value: "maxCapacity-asc",
            label: "Sort by capacity (Low to High)",
          },
          {
            value: "maxCapacity-dsc",
            label: "Sort by capacity (High to Low)",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;

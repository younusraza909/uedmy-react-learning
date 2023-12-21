import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import useGetCabins from "./useGetCabins";

import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CabinTable() {
  const { isLoading, cabins } = useGetCabins();

  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;

  const filteredValue = searchParams.get("discount") || "all";
  let filteredCabins;

  if (filteredValue === "all") filteredCabins = cabins;
  if (filteredValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  if (filteredValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          cabins={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />

        <Table.Footer />
      </Table>
    </Menus>
  );
}

export default CabinTable;
